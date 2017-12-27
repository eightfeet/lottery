import { h, Component } from 'preact';
import ReactModal from 'react-modal';
import s from './Modal.scss';

ReactModal.setAppElement(document.body);

const style = {
	overlay : {
		position          : 'absolute',
		top               : 0,
		left              : 0,
		right             : 0,
		bottom            : 0,
		backgroundColor   : 'rgba(0, 0, 0, 0.45)',
		zIndex:100,
		width: '100%',
		height: '100%'
	},
	content : {
		position                   : 'absolute',
		top                        : '0',
		left                       : '0',
		right                      : '0',
		bottom                     : '0',
		border                     : 'node',
		background                 : 'rgba(0,0,0,0.5)',
		overflow                   : 'auto',
		WebkitOverflowScrolling    : 'touch',
		outline                    : 'none',
		padding                    : '0'
	}
};

export default class Modal extends Component {

	render() {
		const { onRequestClose, children } = this.props;

		return (
			<ReactModal
				shouldCloseOnOverlayClick={false}
				style={style}
				{...this.props}
				className={s.warp}
			>
				{onRequestClose ? <button className={s.close} onClick={onRequestClose} /> : null}
				{children}
			</ReactModal>
		);
	}
}
