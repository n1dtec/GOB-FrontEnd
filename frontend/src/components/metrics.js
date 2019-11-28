import React from 'react'

const Metrics = ({ metrics }) => {
    return (
        <div style={{'textAlign': 'center'}}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{metrics.Temperature}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{metrics.Oxygene_level}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">{metrics.Sound}</h6>
                    </div>
                </div>
        </div>
    )
};

export default Metrics