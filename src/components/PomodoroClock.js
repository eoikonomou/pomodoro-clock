import React from 'react';
import './PomodoroClock.css';

class Options extends React.Component {

    onBreakDecrement = () => {
        this.props.onBreakChange(-1);
    }

    onBreakIncrement = () => {
        this.props.onBreakChange(1);
    }

    onSessionDecrement = () => {
        this.props.onSessionChange(-1);
    }

    onSessionIncrement = () => {
        this.props.onSessionChange(1);
    }

    render() {
        return (
            <div className="options-container">
                <div className="row">
                    <div id="break-label" className="col option-label">Break Length</div>
                    <div id="session-label" className="col option-label">Session Length</div>
                </div>
                <div className="row">
                    <div className="col option-control">
                        <span id="break-decrement" className="arrow-down" onClick={this.onBreakDecrement}>
                            <i className="material-icons md-36">expand_more</i>
                        </span>
                        <span id="break-length" className="option-value">{this.props.options.break}</span>
                        <span id="break-increment" className="arrow-up" onClick={this.onBreakIncrement}>
                            <i className="material-icons md-36">expand_less</i>
                        </span>
                    </div>
                    <div className="col option-control">
                        <span id="session-decrement" className="arrow-down" onClick={this.onSessionDecrement}>
                            <i className="material-icons md-36">expand_more</i>
                        </span>
                        <span id="session-length" className="option-value">{this.props.options.session}</span>
                        <span id="session-increment" className="arrow-up" onClick={this.onSessionIncrement}>
                            <i className="material-icons md-36">expand_less</i>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

class Timer extends React.Component {
    render() {
        return (
            <div className="timer-container">
                <div id="timer-label">{this.props.title}</div>
                <div id="time-left" style={this.props.time.minutes === 0 ? { color: 'black' } : {}}>
                    {this.props.time.minutes.toString().padStart(2, '0')} : {this.props.time.seconds.toString().padStart(2, '0')}
                </div>
            </div>
        );
    }
}

class Controls extends React.Component {

    toggleStart = () => { this.props.onToggleStart(); }
    reset = () => { this.props.onReset(); }

    render() {
        return (
            <div className="control-container">
                <i id="start_stop" className="material-icons" onClick={this.toggleStart}>{this.props.isPaused ? 'play_arrow' : 'pause'}</i>
                <i id="reset" className="material-icons" onClick={this.reset}>replay</i>
            </div>
        );
    }
}

export default class PomodoroClock extends React.Component {
    timerInterval = 0;

    constructor(props) {
        super(props);
        this.state = {
            options: {
                session: 25,
                break: 5
            },
            isPaused: true,
            currentTimerTitle: 'Session',
            currentTime: { minutes: 25, seconds: 0 }
        }
    }

    handleSessionChange = (value) => {
        if (!(value < 0 && this.state.options.session === 1) && !(value > 0 && this.state.options.session === 60)) {
            this.setState((prevState) => {
                let newState = { ...prevState };
                newState.options.session = newState.options.session + value;
                newState.currentTime.minutes = newState.currentTime.minutes + value;
                return newState;
            });
        }
    }

    handleBreakChange = (value) => {
        if (!(value < 0 && this.state.options.break === 1) && !(value > 0 && this.state.options.break === 60)) {
            this.setState((prevState) => {
                let newState = { ...prevState };
                newState.options.break = newState.options.break + value;
                return newState;
            });
        }
    }

    decrementTime = () => {
        let currentTime = { ...this.state.currentTime };
        let currentTimerTitle = this.state.currentTimerTitle;
        if (currentTime.seconds > 0) {
            currentTime.seconds -= 1;
        } else if (currentTime.minutes > 0) {
            currentTime.minutes -= 1;
            currentTime.seconds = 59;
        } else {
            if (currentTimerTitle === 'Session') {
                currentTime.minutes = this.state.options.break - 1;
                currentTimerTitle = 'Break';
            } else {
                currentTime.minutes = this.state.options.session - 1;
                currentTimerTitle = 'Session';
            }
            currentTime.seconds = 59;
        }
        if (currentTime.minutes + currentTime.seconds === 0) {
            document.getElementById('beep').play();
            setTimeout(() => { document.getElementById('beep').pause(); document.getElementById('beep').currentTime = 0; }, 2000);
        }
        this.setState({ currentTimerTitle, currentTime });
    }

    onToggleStart = () => {
        this.setState(prevState => {
            let isPaused = !prevState.isPaused;
            if (isPaused) {
                clearInterval(this.timerInterval);
            } else {
                this.timerInterval = setInterval(() => this.decrementTime(), 1000);
            }
            return { isPaused };
        });
    }

    handleReset = () => {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        document.getElementById('beep').pause();
        document.getElementById('beep').currentTime = 0;
        this.setState({ currentTime: { minutes: 0, seconds: 0 }, options: { break: 5, session: 25 }, isPaused: true, currentTimerTitle: 'Session' });
    }

    render() {
        return (
            <div className="application_wrapper">
                <h1 className="app_title">Pomodoro Clock</h1>
                <Options
                    options={this.state.options}
                    onSessionChange={this.handleSessionChange}
                    onBreakChange={this.handleBreakChange}
                />
                <Timer
                    title={this.state.currentTimerTitle}
                    time={this.state.currentTime}
                />
                <Controls
                    isPaused={this.state.isPaused}
                    onToggleStart={this.onToggleStart}
                    onReset={this.handleReset}
                />
                <h2 className="app_footer">Made with <span role="img" aria-label="love">❤️</span> by <a href="https://github.com/eusoikonomou">Efstathios Oikonomou</a></h2>
                <audio id="beep" preload="auto" src="https://goo.gl/65cBl1"></audio>
            </div>
        );
    }
}
