import { useEffect, useRef, useState } from "react";
import { Container } from "postcss";
import Message from "./Message";
import Receive from "./Receive";
import Send from "./Send";

import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "./firebase";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  setDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import ringer from "./assets/tak.mp3";
import EmojiPicker from "emoji-picker-react";
import Spinner from "./Spinner";
// * storing auth-related information
const auth = getAuth(app);
const db = getFirestore(app);

// * Handling SignIn Related Operations
const SignInHandler = () => {
  // * Instantiating The Object
  const provider = new GoogleAuthProvider();

  // * Passing The Arguments In The 'signInWithPopup' Function
  signInWithPopup(auth, provider);
};
const SignOutHandler = () => {
  signOut(auth);
};
const App = () => {
  // * All The User Related Stuff(data) Would Be Handled By The "State"
  const [User, setUser] = useState(null);
  const [Messages, setMessages] = useState(null);
  const textField = useRef();
  const ref = useRef();

  const audio = new Audio(ringer);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (textField.current.value.length !== 0) {
      // location.href = "http://localhost:5173/#scroll";
      ref.current.scrollIntoView({behaviour: "smooth"});
      try {
        // * Data, That's Going To Be Inserted In The Collection
        const msg = textField.current.value;
        textField.current.value = "";
        const Document = {
          userUnique_Id: User.uid,
          userFullName: User.displayName,
          TextMessage: msg,
          userDP_URL: User.photoURL,
          createdAt: serverTimestamp(),
        };

        // * Creating A Document In The 'Messages' Named Collection
        // ref.current.scrollIntoView({behaviour: "smooth"});

        await addDoc(collection(db, "Messages"), Document);
        audio.play();
      } catch (error) {
        console.log(error);
      }
    }
  };

  // * Fetching-User If The User is "SignIn"
  useEffect(() => {
    // location.href =  "http://localhost:5173/#scroll"

    // * Checking Weather User Sign-In With Their Account Or Not?
    const unSubscribe = onAuthStateChanged(auth, (userData) => {
      // * Setting state with user's  Account Related-Data
      setUser(userData);
    });

    // * 'onSnapshot' Function is Used To Get All Docs In The Given-Collection
    const unSubscribeForMessage = onSnapshot(
      // * Sorting Them According To The Created-Time, In Ascending-Order
      query(collection(db, "Messages"), orderBy("createdAt", "asc")),

      (snap) => {
        setMessages(snap.docs);
      }
    );

    // * Calling unSubscribe Function on Un-Mounting The Component
    return () => {
      // * Un-Subscribing (Removing Listeners), on the Unmounting-Time
      unSubscribe();
      unSubscribeForMessage();
    };
  }, []);

  useEffect(()=> {
    if(ref.current){
      ref.current.scrollIntoView({})
    }
  }, [Messages])

  //  console.log(ref.current)

  return User ? (
    <div className={"mx-auto max-w-[34rem] "}>
      <button
        onClick={SignOutHandler}
        className="flex justify-center items-center space-x-2 px-8 py-2 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out mb-1"
      >
        <i
          style={{ fontSize: "1rem", color: "#fff" }}
          class="bx bx-log-out"
        ></i>{" "}
        <span>Sign Out</span>
      </button>

      <main className="container pt-0.5 overflow-y-auto h-[24rem] mx-auto bg-[#e8e8e8] max-w-[34rem] shadow-xl rounded-lg">
        {/* <Send userName={"ThinkCreatively"} userPhoto={"..."} text={"Demo Tuext Received From..."} /> */}

      
        {Messages ?
          Messages.map((doc, ind) => {
            const { userUnique_Id, userFullName, TextMessage, userDP_URL } =
              doc._document.data.value.mapValue.fields;
            return (
              <div key={ind}>
                {" "}
                {userUnique_Id.stringValue === User.uid ? (
                  <Send
                    userName={userFullName.stringValue}
                    userPhoto={userDP_URL.stringValue}
                    text={TextMessage.stringValue}
                  />
                ) : (
                  <Receive
                    userName={userFullName.stringValue}
                    userPhoto={userDP_URL.stringValue}
                    text={TextMessage.stringValue}
                  />
                )}
              </div>
            );
          }): <Spinner />}
        {/*  // * [Empty-Div], To Scroll To Bottom */}
        <div ref={ref} className="h-1" id="scroll" />
      </main>
      <form
        onSubmit={SubmitHandler}
        className="flex justify-center items-center space-x-3 my-2 shadow-2xl"
      >
        <input
          id="TextArea"
          type="text"
          ref={textField}
          className="max-w-[27rem] rounded-md outline-none p-1 text-sm border-gray-300 border-[1px]"
        />
        {/* <div className="">
          <EmojiPicker  width="15em" />
        </div> */}

        <button
          type="submit"
          className="ml-2 inline-block px-4 py-2 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
          // disabled = {textField.current.length === 0}
        >
          Send
        </button>
        <button onClick={() => ref.current.scrollIntoView({})}>
          <svg
            style={{
              background: "#f7f7f7",
              color: "#c1c1c1",
              borderRadius: "50%",
            }}
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="arrow-alt-circle-down"
            className="w-5 h-5 hover:text-gray-900"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm-32-316v116h-67c-10.7 0-16 12.9-8.5 20.5l99 99c4.7 4.7 12.3 4.7 17 0l99-99c7.6-7.6 2.2-20.5-8.5-20.5h-67V140c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  ) : (
    <div className="h-[100vh] flex justify-center items-center">
      <button
        type="button"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        onClick={SignInHandler}
      >
        Sign With Google
      </button>
    </div>
  );
};

export default App;
