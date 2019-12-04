import React from 'react'

const Metrics = ({ metrics }) => {
    return (
        <div style={{'textAlign': 'center'}}>
                <div className="card" style={{padding: 0}}>
                    <div className="card-body" style={{fontSize: 15, padding: 0}}>
                        <h5 className="card-title text-danger">Room Metrics</h5>
                        <h6 className="card-subtitle mb-2 text-muted"> Temperature : {metrics.Temperature}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Oxygen Level : {metrics.Oxygene_level}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Sound : {metrics.Sound}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Heartbeat : {metrics.Heartbeat}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Humidity : {metrics.Humidity}</h6>
                    </div>
                </div>
        </div>
    )
};

export default Metrics