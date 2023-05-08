"use client";
import { getCurrentUser } from "csc-start/utils/data";
import supabase from "csc-start/utils/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

const useUser = () => {
  const initialState = {
    fullyLoaded: false,
    user: null,
    loading: false,
    error: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "fullyLoaded":
        return { ...state, fullyLoaded: action.value };
      case "user":
        return { ...state, user: action.value };

      case "loading":
        return { ...state, value: action.value };

      case "error":
        return { ...state, error: action.value };
      case "reset":
        return { ...initialState };
    }
  };

  const router = useRouter();

  const [state, dispatch] = useReducer(reducer, initialState);

  const { fullyLoaded, user, loading, error } = state;

  supabase.auth.onAuthStateChange((event, session) => {
    if (["SIGNED_IN", "SIGNED_OUT"].includes(event)) {
      getUser();
    }
  });

  const getUser = async () => {
    dispatch({ type: "loading", value: null });
    const request = await getCurrentUser();

    dispatch({ type: "user", value: request?.data });
    dispatch({ type: "loading", value: false });
    dispatch({ type: "error", value: request?.error?.message });
    dispatch({ type: "fullyLoaded", value: true });
  };

  useEffect(() => {
    dispatch({ type: "loading", value: true });

    getUser();
  }, []);

  return {
    user,
    loading,
    fullyLoaded,
    error,
  };
};

export default useUser;
