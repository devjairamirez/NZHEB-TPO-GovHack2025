import { Buffer } from "buffer";

window.Buffer = Buffer;

import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './swagger.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
