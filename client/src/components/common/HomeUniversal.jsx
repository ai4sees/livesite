import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
import NavbarUniversal from "./NavbarUniversal";
// import Sidebar from "./Sidebar";
import RightSide from "../student/RightSide";
import { useNavigate } from "react-router-dom";
// import getUserIdFromToken from "./auth/authUtils"
import { useParams } from "react-router-dom";
import getUserIdFromToken from "../student/auth/authUtils";
import Spinner from "../common/Spinner";
import { useStudent } from "../student/context/studentContext";

const HomeUniversal = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const idFromToken = getUserIdFromToken();
  const { student, logout } = useStudent();
  const token = localStorage.getItem("token");

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 770);

  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyLargeScreen = window.innerWidth >= 770;
      setIsLargeScreen(isCurrentlyLargeScreen);
      console.log("Screen size changed:", isCurrentlyLargeScreen);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   if (!token) {
  //     navigate("/student/login");
  //     return;
  //   }
  //   if (userId !== idFromToken) {
  //     logout();
  //     navigate("/student/login");
  //     return;
  //   }

  //   console.log(userId);
  // }, [userId, idFromToken, token]);

  // if (!student) {
  //   return <Spinner />;
  // }

  return (
    <>
      <div className="mt-20 text-center">
        <div className="text-3xl lg:text-5xl py-10">
          <h2 className="relative">
            Transform Your <span>Dream Job</span> into Reality
            <span
              className={`absolute left-[44%] md:-bottom-3 lg:-bottom-5 md:h-[6px] lg:h-[8px] bg-orange-500 rounded-xl ${isLargeScreen ? "animate-grow-lg" : "animate-grow-md"
                }`}
            ></span>
          </h2>
        </div>
        <RightSide />
      </div>
    </>
  );
};

export default HomeUniversal;