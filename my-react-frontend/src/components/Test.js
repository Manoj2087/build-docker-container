import React from 'react'
import './Test.css'

export default function Test({prop1, ...restProps}) {
    return (
        <div {...restProps}>
            {console.log(restProps)}
            {/* {console.log(props)} */}
            <h1>test {prop1}</h1>
        </div>
    )
}


