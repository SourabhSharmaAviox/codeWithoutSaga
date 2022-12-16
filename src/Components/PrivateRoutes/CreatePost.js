import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { StartLoader, StopLoader } from "../../Redux/Actions/Loader";
import { postCreatePostFormData } from "../../Redux/Actions/PostActions";
import Store from "../../Redux/store";
import { ApiMethods, ApiUrls } from "../../Shared/ApiUrls";
import { ToastNotification } from "../../Shared/CommonFunctions";

const CreatePost = () => {
  const dispatch = useDispatch();
  const loader = useSelector(state=>state.Loader.loading)
  const {
    register,
    handleSubmit,
    formState: { errors },reset
  } = useForm();


  async function postCreateFormDataFn( payload, callback ) {
    try {
      dispatch(StartLoader());
      const response = await fetch(ApiUrls.CREATE_POST, {
        method: ApiMethods.POST,
        body: payload,
        headers: {
          Authorization: `Bearer ${Store?.getState()?.Auth?.isAuth}`,
        },
      });
      const res = await response.json();
      if (response.status == 201 || response.status == 200) {
        callback("Post is created Succesfully", "success");
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



  const submitHandler = (data) => {
    const val = Object.values(data.postImage);
    const formData = new FormData();
    formData.append("title", data["title"]);
    formData.append("post_image", val[0]);
    formData.append("content", data["content"]);

    postCreateFormDataFn(formData, (message, type) => {
      ToastNotification(message, type);
      reset();
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="row mt-3">
          <div className="col-md-8 offset-2">
            <div className="card">
              <div className="card-title m-auto text-primary ">
                <h4>CREATE POST</h4>
                <hr />
              </div>
              <div className="card-body col-md-8 m-auto">
                <input
                  placeholder="Enter post title"
                  className=" form-control mt-2"
                  type="text"
                  {...register("title", { required: true })}
                />
                {errors.title && (
                  <p className=" text-danger">Please fill this field.</p>
                )}
                <input
                  placeholder="Select File"
                  className="form-control mt-2"
                  type="file"
                  {...register("postImage", { required: true })}
                />
                {errors.postImage && (
                  <p className="text-danger"> Please select file</p>
                )}
                <input
                  placeholder="Please fill this field"
                  className="form-control mt-2"
                  type="text"
                  {...register("content", { required: true })}
                />
                {errors.content && (
                  <p className="text-danger"> Please fill this field.</p>
                )}
                <button disabled={loader} className="btn btn-primary mt-2" type="submit">
                 { loader ? "Creating..." :"Create Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </form>
    </>
  );
};

export default CreatePost;
