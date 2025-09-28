import React from "react";


export default function TestVersion({classnameParent, classnameChild}) {
    return(
        <div className = {classnameParent + " testColumnCommon"}>
            <h2>Learn for test!</h2>
            <h3>Time: unlimited</h3>
            <ul className = "learnColumnList">
                <li className = "learnColumnListEl">Learn for test easily</li>
                <li className = "learnColumnListEl">See the answers and explanations</li>
                <li className = "learnColumnListEl">Take your time, there is no rush</li>
            </ul>
        </div>
    )
}