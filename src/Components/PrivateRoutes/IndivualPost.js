import { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { StartLoader, StopLoader } from "../../Redux/Actions/Loader";
import Store from "../../Redux/store";
import { ApiMethods, ApiUrls, BaseUrl } from "../../Shared/ApiUrls";
import { ToastNotification } from "../../Shared/CommonFunctions";
import DeleteMessage from "../../Shared/DeleteMessage";
import Modall from "../../Shared/Modall";
import EditPost from "./EditPost";

const IndivualPost = ({ posts ,refreshPosts }) => {
  const dispatch = useDispatch();
  const [ModalOpen, SetModalOpen]= useState({
    status:false,
    actionType:""
  })

  const [postDetail, setPostDetail] = useState({});

  const ModalClose =()=>{
     SetModalOpen({actionType:null,status:!ModalOpen.status})
  }
  const handleModalOpen=(act,postt)=>{
    setPostDetail(postt)
    SetModalOpen({actionType:act,status:!ModalOpen.status})
  }


  async function deletePostfn( payload, callback ) {
    try {
      dispatch(StartLoader());
      const response = await fetch(`${ApiUrls.DELETE_POST_API}${payload}`, {
        method: ApiMethods.DELETE,
        headers: {
          Authorization: `Bearer ${Store?.getState()?.Auth?.isAuth}`,
        },
      });
      const res = await response.json();
      if (response.status >= 200 || response.status <= 299) {
        callback(res.Message, "success");
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

  const delteHandler =(delObj)=>{

    deletePostfn(delObj.id,(message,type)=>{
      ToastNotification(message,type)
      refreshPosts();
    })
    ModalClose();
  }



  async function updatePostFn( payload, id, callback ) {
    try {
       dispatch(StartLoader());
  
      const response = await fetch(`${ApiUrls.UPDATE_POST_API}${id}`, {
        method: ApiMethods.PATCH,
        body: payload,
        headers: {
          Authorization: `Bearer ${Store?.getState()?.Auth?.isAuth}`,
        },
      });
  
      const res = await response.json();
      if (response.status >= 200 || response.status <= 299) {
        callback(res.Message, "success");
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

  const getUpdatedDataHandler=(formdata,id)=>{
    updatePostFn(formdata,id, (message, type) => {
      ToastNotification(message, type);
      refreshPosts();
    })
    ModalClose();
  }

  return (
    <>
       <Modall ModalOpen={ModalOpen} Cmp={ ModalOpen.actionType=="Delete"?  DeleteMessage:EditPost}  postDetail={postDetail} handleClose={ModalClose} delteHandler={delteHandler} getUpdatedDataHandler={getUpdatedDataHandler}/>
       
      {posts?.map((item) => {
        return (
          <div key={item.id} className="card offset-1 mt-2 border border-primary border-2" style={{maxWidth: "540px"}}>
            <div className="row g-0">
              <div className="col-md-5">
                <img
                  src={`${BaseUrl}${item.post_image}`}
                  className="img-fluid rounded-start"
                  alt="..."
                />
              </div>
              <div className="col-md-7">
                <div className="card-body">
                  <h5 className="card-title">{item.title.toUpperCase()}</h5>
                  <p className="card-text">{item.content}</p>
                </div>
                <button  className="btn btn-success m-1" onClick={()=>handleModalOpen("Delete",item)}>Delete Post</button>
                <button  className="btn btn-success m-1" onClick={()=>handleModalOpen("Edit",item)}>Edit Post</button>
              </div>
            </div>
          </div>
        );
      })}
      <ToastContainer/>
    </>
  );
};

export default IndivualPost;
