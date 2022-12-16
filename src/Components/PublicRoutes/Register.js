import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { ToastNotification } from "../../Shared/CommonFunctions";
import FormFields from "./FormFields";
import { GetRegisterFormData } from "../../Redux/Actions/AuthAction";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useEffect } from "react";
import Store from "../../Redux/store";
import { ApiMethods, ApiUrls } from "../../Shared/ApiUrls";
import { StartLoader, StopLoader } from "../../Redux/Actions/Loader";

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const loader = useSelector(state=>state.Loader.loading)


  async function postRegisterDataFn( payload, callback ) {
    try {
       StartLoader();
      const response = await fetch(ApiUrls.REGISTER_DATA, {
        method: ApiMethods.POST,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status == 201 || response.status == 200) {
        callback("You are succesfully registred", "success");
      } else if (response.status >= 400 || response.status <= 499) {
        callback("Username is Already registred", "info");
      }
    } catch (err) {
      console.log("errror", err);
      callback("Something went wrong", "error");
    } finally {
      StopLoader();
    }
  }


  const submitHandler = (data) => {
    const payload = {
      username: data["username"],
      first_name: data["first_name"],
      last_name: data["last_name"],
      email: data["email"],
      password: data["password"],
    };

    postRegisterDataFn(payload ,(message, type) => {
       
      ToastNotification(message, type);
      if (type == "success") {
        reset();
        history.push("/login")
      }
    })
   
  };

  useEffect(()=>{
      
    if(!!Store?.getState()?.Auth?.isAuth)
    {
     history.push("/CantAccess")
    }
     
},[])

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="row mt-3">
        <div className="col-md-8 offset-2">
          <div className="card">
            <div className="card-title m-auto text-primary ">
              <h4>REGISTER FORM</h4>
              <hr />
            </div>
            <div className="card-body col-md-8 m-auto">
              <FormFields register={register} errors={errors} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
};

export default Register;
