"use client";
import { getLinksLinks, getSocialLinks, saveLinks } from "csc-start/utils/data";
import { useEffect, useReducer } from "react";
import deepEqual from "deep-equal";
import Skeleton from "./Skeleton";
import useUserMustBeLoggedIn from "csc-start/app/hooks/useUserMustBeLoggedIn";
import useUser from "csc-start/app/hooks/useUser";

const Profile = ({ type = "social" }) => {
  useUserMustBeLoggedIn("/", { message: "foobar" });
  const { user } = useUser();

  useEffect(() => {
    const innerGetLinks = async () => {
      let dbLinks = null;
      if ("social" === type) {
        dbLinks = await getSocialLinks(user.id);
      } else {
        dbLinks = await getLinksLinks(user.id);
      }
      dispatch({ type: "links", value: dbLinks });
      dispatch({ type: "originalLinks", value: dbLinks });
      dispatch({ type: "loading", value: false });
    };
    if (user?.id) {
      innerGetLinks();
    }
  }, [user?.id, type]);

  const initialState = {
    disabled: false,
    addMode: false,
    links: [],
    originalLinks: [],
    loading: true,
    message: {},
    url: "",
    title: "",
    social: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "originalLinks":
        return { ...state, originalLinks: action.value };
      case "links":
        return { ...state, links: action.value };
      case "disabled":
        return { ...state, disabled: action.value };
      case "addMode":
        return { ...state, addMode: action.value };

      case "links":
        return { ...state, links: action.value };
      case "url":
        return { ...state, url: action.value };
      case "title":
        return { ...state, title: action.value };
      case "loading":
        return { ...state, loading: action.value };
      case "message":
        return { ...state, message: action.value };

      case "social":
        return { ...state, social: action.value };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    addMode,
    disabled,
    links,
    url,
    title,
    originalLinks,
    loading,
    message,
  } = state;

  const addButton = (
    <>
      {!addMode && (
        <button
          className="button small px-2 !h1"
          onClick={() => dispatch({ type: "addMode", value: true })}
        >
          +
        </button>
      )}
    </>
  );

  const { success = false, message: resultMessage = null } = message;

  useEffect(() => {
    dispatch({ type: "disabled", value: deepEqual(links, originalLinks) });
  }, [links, originalLinks, disabled]);

  const addItem = (e) => {
    e.preventDefault();
    const linksClone = [...links];
    linksClone.push({
      id: linksClone.length + 1,
      url: url,
      title: title,
      linkType: type,
      order: linksClone.length + 1,
    });
    dispatch({ type: "links", value: linksClone });
    cancelAdd();
  };

  const cancelAdd = () => {
    dispatch({ type: "url", value: "" });
    dispatch({ type: "title", value: "" });
    dispatch({ type: "addMode", value: false });
  };

  const save = async (e) => {
    e.preventDefault();
    dispatch({ type: "message", value: initialState.message });

    if (!!disabled) {
      return;
    }
    const {
      success,
      data = null,
      message = initialState.message,
    } = await saveLinks(user, links, type);
    dispatch({ type: "links", value: links });
    dispatch({ type: "originalLinks", value: links });
    dispatch({ type: "message", value: { success, message, data, links } });
  };

  return (
    <div className="">
      {!disabled && (
        <p className="text-center bg-yellow-200 border-yellow-600 border-2 py-4 px-3 my-5">
          You have unsaved changes
        </p>
      )}
      {Object.keys(message).length > 0 && (
        <div>
          <div
            className={`${
              success
                ? "bg-green-200 border-2 border-green-800 text-green-800"
                : "bg-red-200 border-2 border-red-800 text-red-800"
            } py-2 px-5 my-10 text-center`}
          >
            <span className="font-bold">
              {success
                ? `Success ${resultMessage ? ` ` : ``}`
                : `Failure: ${resultMessage}`}
            </span>
          </div>
        </div>
      )}
      {loading && (
        <div className="my-10">
          <Skeleton />
        </div>
      )}
      {!loading && Array.isArray(links) && links.length === 0 && (
        <>
          <div className="my-10 h2">No {type} links saved yet</div>
          <div>{addButton}</div>
        </>
      )}
      {!loading && Array.isArray(links) && links.length > 0 && (
        <>
          <div className="mb-5 h2 capitalize flex gap-4">
            {type} Links: {addButton}
          </div>
          {Array.isArray(links) && (
            <table className="table-fixed w-full">
              <thead className="text-left">
                <tr>
                  <th className="border border-2 border-black px-2 font-bold">
                    Title
                  </th>
                  <th className="border border-2 border-black px-2 font-bold">
                    URL
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.map(({ title, url }, i) => {
                  return (
                    <tr key={`${url}${i}`} className="my-5 odd:bg-gray-200">
                      <td className="px-2 border border-2 border-black ">
                        {title}
                      </td>
                      <td className="px-2 border border-2 border-black ">
                        {url}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      <div className="flex justify-center gap-5 mt-10">
        {!addMode && links.length > 0 && (
          <button onClick={save} className="button small" disabled={disabled}>
            Save
          </button>
        )}
      </div>
      {!!addMode && (
        <form onSubmit={addItem} className="p-5 bg-[#CCC] mt-5">
          <p className="h2">Add New URL</p>
          <p className="mb-5">
            <label htmlFor="url" className="w-[150px] inline-block">
              URL:{" "}
            </label>
            <input
              id="url"
              required
              type="url"
              value={url}
              className="h3 border-2 border-black inline-block w-[220px]"
              onChange={(e) => dispatch({ type: "url", value: e.target.value })}
            />
          </p>
          {"social" !== type && (
            <p className="mb-5">
              <label htmlFor="title" className="w-[150px] inline-block">
                Title
              </label>
              <input
                required
                id="title"
                type="text"
                value={title}
                className="h3 border-2 border-black inline-block w-[220px]"
                onChange={(e) =>
                  dispatch({
                    type: "title",
                    value: e.target.value,
                  })
                }
              />
            </p>
          )}
          {"social" === type && (
            <p>
              <label className="block" htmlFor="social">
                Social Platform
              </label>
              <select
                id="social"
                className="h3 border-2 border-black inline-block w-[220px] px-5"
                required
                onChange={(e) =>
                  dispatch({ type: "title", value: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="Snapchat">Snapchat</option>
                <option value="Instagram">Instagram</option>
              </select>
            </p>
          )}
          <div className="flex gap-3">
            <input type="submit" className="button small mt-4" value="Add" />
            <input
              type="button"
              onClick={cancelAdd}
              className="button small mt-4"
              value="Cancel"
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
