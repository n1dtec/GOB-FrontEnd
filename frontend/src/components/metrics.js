import React from 'react'

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the section for displaying metrics inside baby's room in a textual format
 */

const Metrics = ({ metrics }) => {
    return (
        <div style={{'textAlign': 'center'}}>
                <div className="card" style={{padding: 0}}>
                    <div className="card-body" style={{fontSize: 15, padding: 0}}>
                        <h5 className="card-title text-danger">Room Metrics</h5>
                        <h6 className="card-subtitle mb-2 text-muted"> Temperature : {metrics.Temperature} F</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Oxygen Level : {metrics.Oxygene_level} %</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Sound : {metrics.Sound} db</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Heartbeat : {metrics.Heartbeat} bpm</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Humidity : {metrics.Humidity} %</h6>
                    </div>
                </div>
        </div>
    )
};

export default Metrics