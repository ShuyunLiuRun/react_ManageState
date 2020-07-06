import React from 'react'
import ReactDOM from 'react-dom'
import AlarmClockDisplay from './AlarmClockDisplay'

//高阶函数compose
//用来串联小的functions
const compose = (...fns) =>
    (arg) =>
        fns.reduce(
            (composed,f) => f(composed),
            arg
        )

//高阶函数render
//当startTicking函数被合成并添加到它的内部时，它将需要接受AlarmClockDisplay作为参数初始化属性
//这个render是在挂载ACD组件，而indexJs里的是挂载整个程序
const render = Component => civilianTime =>{
    ReactDOM.render(
        <Component {...civilianTime}/>,
        document.getElementById('root')
    )
}

// fundational settings
const oneSecond = ()=> 1000
const getCurrentTime = ()=> new Date()
const clear = ()=> console.clear
const log = message => console.log(message)

const serializeClockTime = date =>
({
    hours:date.getHours(),
    minutes:date.getMinutes(),
    seconds:date.getSeconds()
})

const civilianHours = clockTime =>
({
    ...clockTime,
    hours:(clockTime.hours > 12)? clockTime.hours - 12 : clockTime.hours
})

const appendAMPM = clockTime =>
({
    ...clockTime,
    ampm:(clockTime.hours >= 12) ? "PM" : "AM"
})

// -----------------------------------------------------------

const display = target => time => target(time)

const formatClock = format =>
    time =>
        format.replace("hh",time.hours)
        .replace("mm",time.minutes)
        .replace("ss",time.seconds)
        .replace("tt",time.ampm)

const prependZero = key => clockTime =>
({
    ...clockTime,
    [key]:(clockTime[key] < 10) ? "0" + clockTime[key] : clockTime[key]
})

//-------------------------------------------------------------

const convertToCivilianTime = (clockTime) =>
    compose(appendAMPM,civilianHours)(clockTime)

const doubleDigits = civilianTime =>
    compose(prependZero("hours"),prependZero("minutes"),prependZero("seconds"))(civilianTime)

const StartTicking = ()=>
    setInterval(
        compose(clear,
                getCurrentTime,
                serializeClockTime,
                convertToCivilianTime,
                doubleDigits,
                render(AlarmClockDisplay)
        ),
        oneSecond()
    )

export default StartTicking