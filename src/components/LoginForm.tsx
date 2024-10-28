import { Link, useNavigate  } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();


  const onClickSignInGoogle = async () => {
    try {
      const auth = getAuth(app);
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error: any){
      console.log(error);
      toast.error(error?.code);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("로그인에 성공했습니다.");
      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상으로 입력해주세요");
      } else {
        setError("");
      }
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="form form--lg">
        <h1 className="form__title">로그인</h1>
        <div className="form__block">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={email}
            onChange={onChange}
          />
        </div>
        <div className="form__block">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            onChange={onChange}
          />
        </div>
        {error && error?.length > 0 && (
          <div className="form__block">
            <div className="form__error">{error}</div>
          </div>
        )}
        <div className="form__block">
          계정이 없으신가요?
          <Link to="/signup" className="form__link">
            회원가입하기
          </Link>
        </div>
        <div className="form__block">
          <input type="submit" value="로그인" className="form__btn--submit" />
        </div>
        <div className="form__block">
          <input type="button" className="form__btn--submit google" onClick={onClickSignInGoogle} value="G 구글 로그인"/> 
        </div>
      </form>
    </>
  );
}
