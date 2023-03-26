import { BrowserRouter } from "react-router-dom";
import Form from './form/index';
import './css/index.css'

export default function Root() {
  return <BrowserRouter><Form /></BrowserRouter>;
}
