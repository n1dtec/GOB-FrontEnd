import * as React from "react";
import { Chart } from "react-google-charts";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the sound gauge using Google Charts
 */

const SoundGauge = ({sound}) => {
    return (
        <Chart
            width={500}
            height={150}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "", sound ]
            ]}
            options={{
                redFrom: 45,
                redTo: 100,
                redColor: "rgba(113,69,138,0.57)",
                yellowFrom: 37,
                yellowTo: 45,
                yellowColor: "rgba(72,59,82,0.57)",
                backgroundColor: "rgba(76,82,16,0.57)",
                minorTicks: 5,
                min: 15,
                max: 100,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default SoundGauge;