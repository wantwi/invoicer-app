import React from 'react';

import { BoldBI } from '@boldbi/boldbi-embedded-sdk';
import { CustomAxios } from "../../hooks/useCustomAxios.js"



const BRANCH_INFO = JSON.parse(sessionStorage.getItem("BRANCH_INFO"))

//Url of the AuthorizationServer action in ValuesController of the ASP.NET Core application
const authorizationUrl = "/api/authorizationserver";

var BoldBiObj;
class DashboardListing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toke: undefined,
            items: [],
            embedConfig: {},
            companyId: ""
        };
        this.BoldBiObj = new BoldBI();
    };

    renderDashboard(data) {

        this.dashboard = BoldBI.create({

            serverUrl: data.ServerUrl + "/" + data.SiteIdentifier,
            dashboardId: data.DashboardId,
            embedContainerId: "dashboard",
            embedType: data.EmbedType,
            environment: data.Environment,
            mode: BoldBI.Mode.View,
            width: "100%",
            height: window.innerHeight + 'px',
            expirationTime: 100000,
            authorizationServer: {
                url: authorizationUrl,
                headers: {
                    "X-CSRF": 1
                }
            },
            filterParameters: `CompanyId=${this.state.companyId}&&Br_ch=${BRANCH_INFO?.code}`
        });

        this.dashboard.loadDashboard();
    }

    render() {
        return (
            <div id="DashboardListing" style={{ width: "100vw", marginTop: "-10px" }}>
                <div id="container" style={{ width: "100%" }}>
                </div>
                <div id="viewer-section" style={{ width: "100%" }}>
                    <div id="dashboard" style={{ width: "100%" }}></div>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        var dashboard = undefined;
        // var querystring = require('querystring');
        var token = "";



        try {
            const { data } = await CustomAxios.get("/api/GetData")

            const transformedEmbedConfigData = {
                DashboardId: data?.dashboardId,
                EmbedType: data?.embedType,
                Environment: data?.environment,
                ServerUrl: data?.serverUrl,
                SiteIdentifier: data?.siteIdentifier
            };
            this.setState({ embedConfig: transformedEmbedConfigData, companyId: data?.companyId }, () => {
                this.renderDashboard(this.state.embedConfig);
            });

            // const response = await fetch(apiHost + '/api/GetData', {
            //     headers: {
            //         "X-CSRF": 1
            //     }
            // });

            // const data = await response.json();
            // // Transform camelCase keys to PascalCase
            // const transformedEmbedConfigData = {
            //     DashboardId: data.dashboardId,
            //     EmbedType: data.embedType,
            //     Environment: data.environment,
            //     ServerUrl: data.serverUrl,
            //     SiteIdentifier: data.siteIdentifier
            // };
            // this.setState({ embedConfig: transformedEmbedConfigData }, () => {
            //     this.renderDashboard(this.state.embedConfig);
            // });
        } catch (error) {
            console.log(error);
            this.setState({ toke: "error", items: "error" });
        }
    }
}
export default DashboardListing;
