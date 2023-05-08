import supabase from "./supabase";

const getUserIdBySlug = async (slug) => {
  const { data, error } = await supabase
    .from("profile")
    .select("user_id")
    .eq("slug", slug)
    .limit(1)
    .single();

  return { data, error };
};

const getCurrentUser = async () => {
  const session = await supabase.auth.getSession();
  if (session?.data?.session?.user) {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", session.data.session.user.id);

    const user = { ...session.data.session.user };
    user.bargeMeta = data;
    return { data: user, error };
  }

  return null;
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();

  return error;
};

const getLinks = async (user_id) => {
  const { error, data } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return { success: true, data };
};

const getLinksFiltered = async (user_id, by) => {
  if (!["social", "link"].includes(by)) {
    return false;
  }
  const { success, data = null, message = null } = await getLinks(user_id);

  if (!success) {
    return { success, message };
  }

  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data
    .filter(({ linkType }) => linkType === by)
    .sort((a, b) => a.order - b.order);
};

const getSocialLinks = async (userId) => {
  return await getLinksFiltered(userId, "social");
};

const getLinksLinks = async (userId) => {
  return await getLinksFiltered(userId, "link");
};

const saveLinks = async (user, links, type) => {
  const { id } = user;
  const { error: deleteError, data: deleteData } = await supabase
    .from("links")
    .delete()
    .eq("user_id", id)
    .eq("linkType", type);

  if (deleteError) {
    return {
      success: false,
      message: deleteError.message,
    };
  }

  const insertResponse = await supabase.from("links").insert(
    links.map((link) => {
      delete link.id;
      link.user_id = id;
      console.log(link);
      return link;
    })
  );

  const { error: addLinksError, data: addLinksData } = insertResponse;

  if (addLinksError) {
    return {
      success: false,
      message: addLinksError.message,
    };
  }
  return {
    success: true,
    data: addLinksData,
    links,
    message: "Successfully added",
  };
};

//registerUser('foo@bar.com', '1234', 'John Doe', 'john-doe')
const registerUser = async (email, password, name, slug) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("slug", slug);
  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }
  if (data.length > 0) {
    return {
      success: false,
      message: "User slug already exists",
    };
  }

  const authResponse = await supabase.auth.signUp({
    email,
    password,
  });

  if (authResponse.error) {
    return {
      success: false,
      message: authResponse.error.message,
    };
  }

  if (authResponse.data.user) {
    const addMetaResponse = await supabase
      .from("profile")
      .insert([{ user_id: authResponse.data.user.id, name, slug }]);

    if (addMetaResponse.error) {
      return {
        success: false,
        message: addMetaResponse.error.message,
      };
    }
    return {
      success: true,
      message:
        "Registration successful, please wait a few moments to be taken to the login page",
      ...addMetaResponse.data,
    };
  }

  return {
    success: false,
    message: "An unknown error has occurred",
  };
};

const loginUser = async (email, password) => {
  const authResponse = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authResponse.error) {
    return {
      success: false,
      error: authResponse.error,
    };
  }

  if (authResponse.data.user) {
    const meta = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", authResponse.data.user.id);

    if (meta.error) {
      return {
        success: false,
        error: meta.error,
      };
    }
    return {
      ...authResponse,
      meta,
      success: true,
    };
  }

  return {
    success: false,
    message: "An unknown error has occurred",
  };
};

export {
  getUserIdBySlug,
  loginUser,
  registerUser,
  getLinksLinks,
  getSocialLinks,
  getCurrentUser,
  logout,
  saveLinks,
};
