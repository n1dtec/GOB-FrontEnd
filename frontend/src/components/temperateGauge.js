import * as React from "react";
import { Chart } from "react-google-charts";

/*
 * Author : Harnidh Kaur
 * Project : Guardians of the Babies
 * Subject : TCSS 559
 *
 * This class builds the temperature gauge using Google Charts
 */

const TemperateGauge = ({temperature}) => {
    return (
        <Chart
            width={500}
            height={150}
            chartType="Gauge"
            loader={<div>Loading Chart</div>}
            data={[
                [ 'Label', 'Value' ],
                [ "", temperature ]
            ]}
            options={{
                redFrom: 85,
                redTo: 100,
                redColor: "rgba(229,103,22,0.36)",
                yellowFrom: 75,
                yellowTo: 85,
                yellowColor: "rgba(99,99,214,0.07)",
                backgroundColor: "rgba(76,82,16,0.57)",
                minorTicks: 5,
                min: 50,
                max: 100,
                is3D: true
            }}
            rootProps={{ 'data-testid': '1' }}
        />
    );
};
export default TemperateGauge;