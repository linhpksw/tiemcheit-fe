import ReactDOM from 'react-dom';

const ModalRoot = ({ children }) => {
	const modalRoot = document.getElementById('modal-root');
	return ReactDOM.createPortal(children, modalRoot);
};

export default ModalRoot;
