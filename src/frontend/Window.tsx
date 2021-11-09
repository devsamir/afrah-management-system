import React from "react";
import { MdClose, MdCropDin, MdRemove } from "react-icons/md";
import { remote } from "electron";

// const { BrowserWindow } = require("electron");
const { BrowserWindow } = remote.require("electron");

const minimizeWindow = () => {
  const window = BrowserWindow.getFocusedWindow();
  window.minimize();
};
const maximizeWindow = () => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window.isMaximized()) {
    window.maximize();
  } else {
    window.unmaximize();
  }
};
const closeWindow = () => {
  const window = BrowserWindow.getFocusedWindow();
  window.close();
};
interface Props {}
const Window: React.FC<Props> = ({ children }) => {
  return (
    <>
      <div className="toolbar">
        <div className="title">AMS</div>
        <div className="toolbar-buttons">
          <button className="button" onClick={minimizeWindow}>
            <MdRemove />
          </button>
          <button className="button" onClick={maximizeWindow}>
            <MdCropDin />
          </button>
          <button className="button-danger" onClick={closeWindow}>
            <MdClose />
          </button>
        </div>
      </div>
      {children}
    </>
  );
};

export default Window;
