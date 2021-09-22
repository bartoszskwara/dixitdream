import React, {useCallback, useContext, useEffect, useState} from 'react'
import {ThemeContext} from 'components/themes';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        fontSize: 18
    }
}));

const getTimeRemaining = (endDate) => {
    const total = new Date(endDate * 1000) - new Date();
    const seconds = Math.floor( (total/1000) % 60 );
    const minutes = Math.floor( (total/1000/60) % 60 );
    const hours = Math.floor( (total/(1000*60*60)) % 24 );
    const days = Math.floor( total/(1000*60*60*24) );
    return {
        total: total >= 0 ? total : 0,
        days: days >= 0 ? days : 0,
        hours: hours >= 0 ? hours : 0,
        minutes: minutes >= 0 ? minutes : 0,
        seconds: seconds >= 0 ? seconds : 0
    };
}

const formatCountdown = (time) => {
    let countdown = "";
    if(time.days) {
        countdown += `${time.days}d : `;
    }
    if(time.hours || time.days) {
        countdown += time.hours < 10 ? `0${time.hours}` : time.hours;
        countdown += "h : ";
    }
    if(time.minutes || time.hours || time.days) {
        countdown += time.minutes < 10 ? `0${time.minutes}` : time.minutes;
        countdown += "m : ";
    }
    if(time.seconds || time.minutes || time.hours || time.days) {
        countdown += time.seconds < 10 ? `0${time.seconds}` : time.seconds;
        countdown += "s";
    }
    return countdown;
}

const Countdown = ({ endDate, setChallengeEnded, refreshChallenge }) => {
    const classes = useStyles(useContext(ThemeContext).theme);
    const [timeRemaining, setTimeRemaining] = useState("");

    const calculateTime = useCallback((callback) => {
        const time = getTimeRemaining(endDate);
        if (time.total >= 1000) {
            setTimeRemaining(formatCountdown(time));
        } else {
            setChallengeEnded(true);
            setTimeRemaining("");
            if (callback) {
                callback();
            }
            refreshChallenge();
        }
    }, [endDate, setChallengeEnded]);

    useEffect(() => {
        let interval;
        if (endDate) {
            calculateTime();
            interval = setInterval(() => {
                calculateTime(() => clearInterval(interval));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [endDate, setChallengeEnded]);

    return (
        <div className={classes.root}>
            {timeRemaining && <span>{timeRemaining}</span>}
        </div>
    );
}

export default Countdown;