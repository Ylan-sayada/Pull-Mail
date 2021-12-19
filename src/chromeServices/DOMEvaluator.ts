
const messagesFromReactAppListener = (
    msg: chrome.runtime.MessageOptions,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void) => {

    const data = Array.from(document.querySelectorAll(".feed-shared-text.relative span"));

    let mails: string[] | string[][] = []

    mails = data.map((element) => {
        return [...new Set((element as HTMLElement).innerText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/))];
    }).filter(element => element !== null);

    mails = [...new Set([...new Set(mails)].flat())];
    let myResponse: string[] = mails;
    sendResponse(myResponse);
}

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);