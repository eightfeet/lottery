import { h, Component } from 'preact';

import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { setRuntimeVariable } from '~/actions/user';
import getRem from '~/core/utils/getRem';
import defaultUi from './defaultUi.json';
import Winning from './components/Winning';

import Loading from '~/components/Loading';
// import { apiTest } from '~/servicer/index.js';
import scss from './scss';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			startMusic: true,
			provinces: [],
			runtimeVariable: 'this is a runtimeVariable',
			UI: {},
			degArr: [],
			prizes: [],
			prizeDeg: 0,
			oldDge: 0,
			chance: 3,
			involved: 300,
			Winning: {},
			openWinning: false
		};
		this.lotteryDrawing = false;
		this.roundTimer = null;
	}

	componentWillMount() {
		this.setState({
			UI: defaultUi,
			prizes: defaultUi.prizes
		});
	}

	componentDidMount () {
		this.setWheel();
	}


	setWheel = () => {
		//奖品类别数量
		const prize = this.state.prizes;
		const prizeNum = prize.length;

		if (prizeNum < 2 || prizeNum > 8) {
			console.error("奖品数不合理");
			return;
		}

		const degArr = [];
		const deg = 360/prizeNum;
		prize.forEach((item, i) => {
			//奖品角度差
			const angle = 360 / prizeNum * i;
			degArr.push(angle);
		});

		this.setState({
			degArr,
			deg
		});
	}

	renderRule = () => {
		const { UI } = this.state;
		return (<div className={scss.rule}
			style={{
				left: getRem('255px'),
				top: getRem('5px')
			}}
		>
			<img src={UI.rule} />
		</div>);
	}

	renderDivide = (degArr) => {
		const { UI } = this.state;
		return degArr.map((item)=>(
			<div
				className={scss.prizedivide}
				style={{
					transform: `rotate(${item}deg)`
				}}
			>
				<img src={UI.line} />
			</div>
		));
	}

	renderPrize = (degArr) => {
		const prize = this.state.prizes;
		const { deg } = this.state;
		const R = 26.66/2 - 1;
		const radian = Math.PI/180 * deg;
		const halfR =  Math.sqrt(R*R/(3+2*(Math.sin(radian) - Math.cos(radian))));
		const width = halfR*2*Math.sin(radian/2);
		const distance = halfR*Math.cos(radian/2);

		return degArr.map((item, index)=>(
			<div
				className={scss.prizeitem}
				style={{
					transform: `rotate(${item + (deg/2)}deg) translateY(${-distance}rem)`,
					width: `${width}rem`,
					height: `${width}rem`,
					marginLeft: `${width/-2}rem`
				}}
			>
				<img src={prize[index].img} />
			</div>
		));
	}

	renderMusic = () => {
		return <div
			className = {`${scss.music} ${ this.state.startMusic ? scss.musicOn : scss.musicOff}`}
			onClick = {this.handleMusic}
		>
			<audio src="~~~~" autoplay onLoad={this.autoStartPlay} ref={ref => {this.audio = ref;}}>
				您的浏览器不支持 audio 标签。
			</audio>
		</div>;
	}

	handleMusic = () => {
		if (this.state.startMusic) {
			this.audio.play();
		} else {
			this.audio.pause();
		}
		this.setState({
			startMusic: !this.state.startMusic
		});
	}

	// 是否能解决有的手机不能自动播放的问题？待测试
	autoStartPlay = () => {
		this.audio.play();
	}

	startDrawingLottery = (i, time, round) => {
		const { deg, prizes } = this.state;
		if (this.lotteryDrawing) {
			return Promise.reject('当前正在抽奖！');
		}
		this.lotteryDrawing = true;
		return new Promise((resolve) => {
			const newtime = parseInt(time, 0) || 5;
			const length = prizes.length;
			const defaultRound = round || 6;

			let position = 0;
			const halfDeg = deg / 2;
			let prize = {};
			prizes.forEach((el, index) => {
				if (el.id === i) {
					position = length - (index + 1);
					prize = el;
				}
			});

			let newdeg = deg * position;
			newdeg += 360*defaultRound; // 默认旋转几周
			newdeg = newdeg + halfDeg;
			newdeg = newdeg + this.state.oldDge;
			const oldDge = newdeg - (newdeg%360);
			this.setState({
				oldDge
			});
			const css = `-webkit-transition-duration: ${newtime}s;
						transition-duration: ${newtime}s;
						-webkit-transform: rotate(${newdeg}deg);
						transform: rotate(${newdeg}deg)`;
			this.planRef.setAttribute('style', css);
			window.clearTimeout(this.roundTimer);
			this.roundTimer = setTimeout(() => {
				resolve(prize);
				this.lotteryDrawing = false;
			}, newtime * 1000);

		});

	}

	handleDrawingLottery = () => {
		Loading.show();
		setTimeout(() => {

			Loading.hide();
			const prize = parseInt(7*Math.random(), 0); // 测试随机数
			this.startDrawingLottery(prize)
				.then((res) => {
					this.setState({
						Winning: res,
						openWinning: true
					});
					console.log(res);
				}).catch(error => console.error(error));

		}, 800);
	}

	close = () => {
		this.setState({
			openWinning: false
		});
	}


	render() {
		// console.log('test redux', this.props);
		const { UI, degArr, chance, involved } = this.state;
		return (
			<div
				class={scss.root}
				style={{
					backgroundImage: `url(${UI.mainbg})`
				}}
			>
				{/*-- 音乐按钮 --*/}
				{
					this.renderMusic()
				}
				{/*-- 规则按钮 --*/}
				{
					this.renderRule()
				}
				<div class="pdt2-5">
					<div className={scss.wheelbase} >
						<img className={scss.placeholder} src="./assets/blank.gif" />
						{/*-- 指针 --*/}
						<div className={scss.needle} onClick={this.handleDrawingLottery}>
							<img src={UI.needle} />
						</div>
						{/*-- 轮 --*/}
						<div className={scss.wheel} ref={ref => {this.planRef = ref;}}>
							{
								this.renderDivide(degArr)
							}
							{
								this.renderPrize(degArr)
							}
							<img src={UI.wheel} />
						</div>
					</div>
				</div>
				<div className={scss.info}>
							已有<span>{involved}</span>人参与 <br />
							您今天还有<span>{chance}</span>次抽奖机会
				</div>
				<Winning
					isOpen={this.state.openWinning}
					onRequestClose={this.close}
					prizes={this.state.Winning}
				/>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state;
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({ setStore: setRuntimeVariable}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
