import React, { useEffect, useState } from 'react';
import TitleImg from './img/linkedinMail.png';
import { ReactComponent as Spinner } from './img/spinner.svg';
import './App.css';
function App() {
  const [currentMailDetected, setCurrentMailDetected] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isLinkedin, setIsLinkedin] = useState(false);
  let getCurrentTab = async (): Promise<string | undefined> => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.url;
  }

  let getMail = async () => {
    try {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id || 0,
          { type: 'GET_DOM' },
          (response: string[]) => {
            setCurrentMailDetected(response);
            setIsChecked(true);
          })
      })
    } catch (e) {
      console.log("something gone wrong..." + e);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        let currentUrl = await getCurrentTab();
        if (currentUrl?.includes("https://www.linkedin.com/")) {
          setIsLinkedin(true);
          getMail();
        }
        else {
          setIsChecked(true);
        }
      } catch (e) {
        console.log("something gone wrong \n" + e);
      }

    })();
  });

  return (
    <div className="App" style={{ minWidth: "200px" }}>
      <div style={{ padding: "10px", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
        <img src={TitleImg} alt="Pull mail title" style={{ width: "40%" }} />
        <h1>Pull Mail</h1>
        <h4 style={{ textAlign: "center", padding: "0", margin: "0 0 5px 0" }}>Scrap mail from linkedin post</h4>
        {isLinkedin ?
          <>
            {isChecked ?
              <>
                <p>{currentMailDetected.length} email adress{currentMailDetected.length > 1 && "es"} found{currentMailDetected.length > 1 && "s"}!</p>
                <button onClick={() => window.open(`mailto:${currentMailDetected}`, '_blank')}>
                  Send Mail
                </button>
              </>
              :
              <Spinner />
            }
          </>
          :
          <p>You are not on Linkedin!</p>
        }
      </div>
    </div>
  );
}

export default App;
