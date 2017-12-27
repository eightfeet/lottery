import { h, Component } from 'preact';
import Modal from '~/components/Modal';
import s from './Winning';

export default class App extends Component {
	/**
	 *	@param {Object} prizes		prizes.type 1积分 2实物 3未中奖
	 */

	render() {
		const { prizes, ...other } = this.props;
		return (
			<Modal {...other} >
				{
					prizes.type !== 3 ? (
						<div className={s.root}>
							<div className={s.prizebox}>
								<div className={s.roll}>
									<img src="./assets/light.png" />
								</div>
								<h2 className={s.title1}>恭喜你获得了</h2>
								<div className={s.prize}>
									<img src={prizes.img || '../assets/gift.png'}/>
								</div>
								<h3 className={s.title2}>{prizes.title || "无奖品标题"} </h3>
								<div className={s.leve}>{prizes.title || "无奖品级别"} </div>
							</div>
							<div className="al-c pdt2">
								<button className="w6 bg-green white pd1 font radius-smaller">
									查看奖品详情
								</button>
							</div>
						</div>
					) : (
						<div className={s.root}>
							<div className={s.fail}>
								<img src="./assets/faiImg.png" />
							</div>
							<div className="al-c pdt2">
								<button className="w6 bg-green white pd1 font radius-smaller">
									再来一次
								</button>
							</div>
						</div>
					)
				}
			</Modal>
		);
	}
}
