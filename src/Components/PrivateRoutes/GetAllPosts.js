import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { AuthRemove } from "../../Redux/Actions/AuthAction";
import { StartLoader, StopLoader } from "../../Redux/Actions/Loader";
import { GetAllPostaAction, SaveAllPostAction } from "../../Redux/Actions/PostActions";
import Store from "../../Redux/store";
import { ApiMethods, ApiUrls } from "../../Shared/ApiUrls";
import { ToastNotification } from "../../Shared/CommonFunctions";
import IndivualPost from "./IndivualPost";

const GetAllPost = () => {
  const dispatch = useDispatch();
  const All_Posts = useSelector((state) => state.Post.AllPosts);



  async function getAllPostFn(callback ) {
    try {
      dispatch(StartLoader());
      const response = await fetch(ApiUrls.GET_ALL_POST, {
        method: ApiMethods.GET,
        headers: {
          Authorization: `Bearer ${Store?.getState()?.Auth?.isAuth}`,
        },
      });
      const res = await response.json();
  
      if (response.status >= 200 || response.status <= 299) {
        callback(res.Message, "success");
        dispatch(SaveAllPostAction(res.Data));
      } else if (response.status >= 400 || response.status <= 499) {
        callback(res.Message, "warn");
      } else {
        callback(res.Message, "warn");
      }
    } catch (err) {
      console.log("errror", err);
      callback("Something went wrong", "error");
    } finally {
      dispatch(StopLoader());
    }
  }

  const getPosts =()=>{
    getAllPostFn((message, type) => {
      //ToastNotification(message, type);
      if (type == "error") {
        dispatch(AuthRemove());
      }
    })
   
  }

  useEffect(() => {
   getPosts();
  }, []);

  return (
    <>
      <div className="row">
        <IndivualPost refreshPosts={getPosts} posts={All_Posts} />
      </div>
      <ToastContainer />
    </>
  );
};

export default GetAllPost;
