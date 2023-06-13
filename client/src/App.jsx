import { useState, useEffect } from "react";
import axios from "axios";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";

// let dummy = [
//   { type: "user", post: "Hello my name is Bharat" },
//   { type: "bot", post: "Hello Bharat, How can i assist you?" },
// ];

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  // const posts = dummy;
  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "http://localhost:3000",
      { input },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  };

  const onSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput("");
    fetchBotResponse().then((res) => {
      console.log(res.bot.trim());
      updatePosts(res.bot.trim(), true);
    });
  };
  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? "loading" : "user", post }];
      });
    }
  };

  const onKeyUp = (e) => {
    // console.log(e);
    if (e.key === "Enter" || e.code === "Enter" || e.which === 13) onSubmit();
  };

  return (
    <>
      {/* <h1>Hello guys</h1> */}
      <main className="chatCGPT-app">
        <section className="chat-container">
          <div className="layout">
            {posts.map((post, index) => (
              // console.log(index);
              <div
                key={index}
                className={`chat-bubble ${
                  post.type === "bot" || post.type === "loading" ? "bot" : ""
                }`}
              >
                <div className="avatar">
                  <img
                    src={
                      post.type === "bot" || post.type === "loading"
                        ? bot
                        : user
                    }
                  />
                </div>
                {post.type === "loading" ? (
                  <div className="loader">
                    <img src={loadingIcon} />
                  </div>
                ) : (
                  <div className="post">{post.post}</div>
                )}
                {/* {console.log(post)} */}
              </div>
            ))}
          </div>
        </section>
        <footer>
          <input
            className="composebar"
            placeholder="Ask Anything!!"
            autoFocus={true}
            type="text"
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={onKeyUp}
            value={input}
          />
          <div className="send-button" onClick={onSubmit}>
            <img src={send} />
          </div>
        </footer>
      </main>
    </>
  );
}

export default App;
