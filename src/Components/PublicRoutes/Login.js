import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastNotification } from "../../Shared/CommonFunctions";
import { ToastContainer } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom";
import { AuthSet } from "../../Redux/Actions/AuthAction";
import { useEffect } from "react";
import Store from "../../Redux/store";
import { StartLoader, StopLoader } from "../../Redux/Actions/Loader";
import { ApiMethods, ApiUrls } from "../../Shared/ApiUrls";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const loader = useSelector((state) => state.Loader.loading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  async function postLoginDataFn( payload, callback ) {
    try {
      StartLoader();
      const response = await fetch(ApiUrls.LOGIN_DATA, {
        method: ApiMethods.POST,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status == 201 || response.status == 200) {
        const res = await response.json();
        
        callback("You are succesfully logged In", "success");
        const userData = {
          username: payload.username,
          token: res.Data.token.access,
        };
  
        delete payload.password;
        payload.token = res.Data.token.access;
        console.log(payload,"login payload")
        dispatch(AuthSet(payload))
      } else if (response.status >= 400 || response.status <= 499) {
        callback("Username or password is wrong", "warn");
      }
    } catch (err) {
      console.log("errror", err);
      callback("Something went wrong", "error");
    } finally {
      StopLoader();
    }
  }

  const loginHandler = (data) => {
    let payload = {
      username: data["username"],
      password: data["password"],
    };

    postLoginDataFn(payload ,(message, type) => {
      ToastNotification(message, type);
      if (type == "success") {
        history.push("/createpost");
      }
    })
  };

  useEffect(() => {
    if (!!Store?.getState()?.Auth?.isAuth) {
      history.push("/CantAccess");
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(loginHandler)}>
      <div className="row mt-3">
        <div className="col-md-8 offset-2">
          <div className="card">
            <div className="card-title m-auto text-primary">
              <h4>LOGIN FORM</h4>
              <hr />
            </div>
            <div className="card-body col-md-8 m-auto">
              <input
                placeholder="Enter username"
                className="form-control mb-2"
                type={"text"}
                {...register("username", {
                  required: true,
                })}
              />
              {errors["username"]?.type == "required" && (
                <p className="text-danger">Please fill username</p>
              )}

              <input
                placeholder="Enter password"
                className="form-control mb-2"
                type={"password"}
                {...register("password", {
                  required: true,
                })}
              />
              {errors["password"]?.type == "required" && (
                <p className="text-danger">Please fill password</p>
              )}

              <button
                disabled={loader}
                className="btn  btn-primary px-5 mx-lg-5"
                type="submit"
              >
                {loader ? "Logging..." : "Sign In"}
              </button>

              <button className="btn " type="submit">
                New user? <Link to="/register">Sign Up</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
};

export default Login;
