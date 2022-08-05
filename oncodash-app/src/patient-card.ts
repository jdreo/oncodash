import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

/** A widget that displays basic clinical information about a patient.
 *
 * Updates from the parent mediator comes through the `patient_id` property.
 * Changing the `patient_id` value will trigger a new fetch for data.
 *
 * May dispatch a `selected_patient` event when clicked.
 *
 * Sections can be hidden to produce smaller patient cards.
 */
@customElement("oncodash-patient-card")
export class ODPatientCard extends LitElement {
    /** Constructor.
     *
     * The only required info is the patient's ID.
     * Other parameters change the appearance of the widget.
     *
     * @note as `styles` expects an object, Lit will transliterate CSS' property names
     *       from/to camelCase to/from kebab-case.
     *       For instance, pass `fontStyle` to reach CSS' `font-style`.
     *       Properties' values should be strings.
     *
     * @param patient_id the patient to fetch and display
     * @param styles additional CSS to apply on this instance (see Lit's `styleMap`)
     * @param hideHeader if true, do not display the header section of the patient card
     * @param hideMain if true, do not display the main section of the patient card
     * @param hidePrimary if true, do not display the primary section of the patient card
     * @param hideSecondary if true, do not display the secondary section of the patient card
     * @param hideTertiary if true, do not display the tertiary section of the patient card
     * @param hideFooter if true, do not display the footer section of the patient card
     * @param eventOnClick if true, dispatch an event when clicked
     */
    constructor(
        patient_id: number,
        styles: object = { fontStyle: "xx-large" },
        hideHeader = false,
        hideMain = false,
        hidePrimary = false,
        hideSecondary = false,
        hideTertiary = false,
        hideFooter = false,
        eventOnClick = false
    ) {
        super();
        this.styles = styles;
        this.hideHeader = hideHeader;
        this.hideMain = hideMain;
        this.hidePrimary = hidePrimary;
        this.hideSecondary = hideSecondary;
        this.hideTertiary = hideTertiary;
        this.hideFooter = hideFooter;
        this.eventOnClick = eventOnClick;
        // Triggers the fetch/update, so called last.
        this.patient_id = patient_id;
    }

    // We overload the setter for the `patient_id` attribute
    // because we want to trigger an update of the corresponding data.
    // Hence, every time the Mediator widget does change this attribute,
    // we will fetch new data.
    @property({ type: Number })
    set patient_id(patient_id: number) {
        // The "true" attribute is private and prefixed by convention.
        this._patient_id = patient_id;
        this.fetchItem(patient_id);
        this.requestUpdate("patient_id", patient_id);
    }
    // The corresponding getter.
    get patient_id() {
        return this._patient_id;
    }
    // The "true" attribute.
    private _patient_id: number = Number.NaN;

    /** Additional CSS styles to apply on this instance.
     *
     * See Lit's `styleMap`.
     *
     * Note: as `styles` expects an object, Lit will transliterate CSS' property names
     *       from/to camelCase to/from kebab-case.
     *       For instance, pass `fontStyle` to reach CSS' `font-style`.
     *       Properties' values should be strings.
     */
    @property()
    styles = {};

    /** This attribute holds the data that this widget is actually displaying.
     * As a `state`, every time it is changed, it will automatically
     * trigger an update sequence.
     */
    @state()
    patient: any = {
        time_series: {
            nothing: {
                x: [0],
                y: [0],
                colors: ["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0)"],
                thresholds: [0, 1],
            },
        },
    };

    /** If true, hide the "header" section.
     */
    @property({ type: Boolean })
    hideHeader = false;

    /** If true, hide the "main" section.
     */
    @property({ type: Boolean })
    hideMain = false;

    /** If true, hide the "primary" section.
     */
    @property({ type: Boolean })
    hidePrimary = false;

    /** If true, hide the "secondary" section.
     */
    @property({ type: Boolean })
    hideSecondary = false;

    /** If true, hide the "tertiary" section.
     */
    @property({ type: Boolean })
    hideTertiary = false;

    /** If true, hide the "footer" section.
     */
    @property({ type: Boolean })
    hideFooter = false;

    /** If true, allow the widget to dispatch a `selected_patient` event when clicked.
     */
    @property({ type: Boolean })
    eventOnClick = false;

    /** The function called when the `patient_id` is changed.
     *
     * It downloads the corresponding data that this widget is displaying.
     */
    private async fetchItem(id: number): Promise<any> {
        const apiUrl = `http://localhost:8888/api/clinical-overview/data/${id}/`;
        let response: any;
        try {
            // Wait for the asynchronous `fetch` function to terminate.
            // Either it ends on a result or raise an exeption.
            response = await fetch(apiUrl);
        } catch (error) {
            console.error("[ODPatientCard]", error);
        }
        if (!response.ok) {
            console.error("[ODPatientCard] failed fetched patient", id);
            throw new Error(response.statusText);
        } else {
            // Convert the payload to JSON.
            const patient = await response.json();
            const time_series = this.fetchTimeSeries();
            // Set the fetched data as the new ones
            // to display in the Viewer widget.
            this.patient = patient;
            this.patient.time_series = time_series;
        }
    }

    /** Create random vector of length n
     *
     * @param n length
     * @param a amplitude
     * @param b offset
     * @returns
     */
    private randomVector(n: number, a = 10, b = 0): number[] {
        const vec: number[] = [];
        for (let i = 0; i < n; i++) {
            let rand = Math.random() * a + b - a / 2;
            rand = Math.round(rand);
            if (rand < 0) rand = 0;
            vec.push(rand);
        }
        return vec;
    }

    /** Create a vector of incremental integers of length n
     *
     * @param n length
     * @returns vector
     */
    private getXOfLength(n: number): number[] {
        //
        const foo = new Array(n);
        for (let i = 0; i < foo.length; i++) {
            foo[i] = i + 1;
        }
        return foo;
    }

    /** Create fake time series
     *
     * @returns Object{'name': [...]}
     */
    private fetchTimeSeries(): Record<string, any> {
        //
        const n = 100;
        const time_series: Record<string, any> = {
            "Temperature_[°C]": {
                x: this.getXOfLength(n),
                y: this.randomVector(n, 6, 36),
                colors: [
                    "rgba(198, 198, 45, 1)",
                    //  "rgba(184, 249, 152, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(250, 255, 0, 1)",
                ],
                thresholds: [35, 37],
            },
            "Blood_Pressure_[mmHg]": {
                x: this.getXOfLength(n),
                y: this.randomVector(n, 50, 100),
                colors: [
                    "rgba(165, 128, 54, 1)",
                    //  "rgba(184, 249, 152, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(255, 131, 0, 1)",
                ],
                thresholds: [80, 120],
            },
            "CA12-5_[units/mL]": {
                x: this.getXOfLength(n),
                y: this.randomVector(n, 16000, 7500),
                colors: [
                    "rgba(54, 150, 165, 1)",
                    //  "rgba(184, 249, 152, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(0, 242, 255, 1)",
                ],
                thresholds: [35, 15000],
            },
            "Hemoglobin_[g/L]": {
                x: this.getXOfLength(n),
                y: this.randomVector(n, 90, 155),
                colors: [
                    "rgba(165, 54, 134, 1)",
                    //  "rgba(184, 249, 152, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(255, 0, 106, 1)",
                ],
                thresholds: [117, 155],
            },
            Platelets: {
                x: this.getXOfLength(n),
                y: this.randomVector(n, 300, 225),
                colors: [
                    "rgba(165, 121, 54, 1)",
                    //  "rgba(184, 249, 152, 1)",
                    "rgba(255, 255, 255, 1)",
                    "rgba(255, 123, 0,1)",
                ],
                thresholds: [150, 350],
            },
        };
        return time_series;
    }

    /** Render the widget. */
    override render() {
        // render = (): HTMLElement => { // FIXME does not fix the false undefined patient error
        const div = document.createElement("div");

        if (Number.isNaN(this.patient_id)) {
            console.error("[ODPatientCard] Cannot render, no patient_id");
            return div;
        }

        if (this.patient === undefined) {
            console.error("[ODPatientCard] No patient data");
            return div;
        }

        return html`
            <h2 class="widget-title">Selected Patient</h2>
            <div
                id="patient-card"
                style=${styleMap(this.styles)}
                @click=${this.eventOnClick ? this.onClick : ""}
            >
                ${this.hideHeader ? "" : this.tHeader()}
                <div id="patient-main">
                    ${this.hideMain ? "" : this.tMain()}
                    ${this.hidePrimary ? "" : this.tPrimary()}
                    <!-- <form> -->
                    ${this.hideSecondary ? "" : this.tSecondary()}
                    ${this.hideTertiary ? "" : this.tTertiary()}
                    <!-- </form> -->
                </div>
                <!-- patient-main -->
                ${this.hideFooter ? "" : this.tFooter()}
            </div>
            <!-- patient-card -->
        `;
    }

    /** Dispatch a `patient_selected` event up.
     */
    private onClick(e: Event) {
        const id = this.patient_id;
        if (!Number.isNaN(id)) {
            const options = {
                detail: { id },
                bubbles: true, // can bubble up through the DOM
                composed: true, // can bubble across the boundary between the shadow DOM and the regular DOM
            };
            this.dispatchEvent(new CustomEvent("patient_selected", options));
        } else {
            // Error management.
            console.error(
                "[ODPatientSelector] User selected patient, but patient_id is",
                id
            );
        }
    }

    /** Template of the header section.
     *
     * Displays:
     * - cud_survival,
     * - patient's ID.
     */
    private tHeader() {
        const is_alive: boolean = this.patient.cud_survival == "ALIVE";
        return html`
            <div id="patient-header">
                <h3 class="patient-main-item">
                    <span id="patient-survival">
                        <img
                            alt="${this.patient.cud_survival}"
                            title="${this.patient.cud_survival}"
                            class=${is_alive
                                ? "patient-alive"
                                : "patient-not-alive"}
                            src=${is_alive
                                ? "assets/alive.svg"
                                : "assets/not-alive.svg"}
                        />
                    </span>
                    <!-- patient-survival -->
                    <span id="patient-name">${this.patient.patient}</span>
                </h3>
            </div>
            <!-- patient-header -->
        `;
    }

    /** Template of the main section.
     *
     * Displays:
     * - age,
     * - cud_histology,
     * - cud_stage.
     */
    private tMain() {
        return html`
            <p class="patient-main-item">
                <span id="patient-age">${this.patient.age}y</span>
                <span id="patient-cud_histology"
                    >${this.patient.cud_histology}</span
                >
                <span id="patient-cud_stage">${this.patient.cud_stage}</span>
            </p>
            <!-- patient-main-item -->
        `;
    }

    /** Template of the primary section.
     *
     * Displays:
     * - cud_treatment_strategy,
     * - cud_primary_therapy_outcome,
     * - cud_current_treatment_phase,
     * - maintenance_therapy,
     * - cud_stage_info,
     * - progression_detection_method,
     * - extra_patient_info,
     * - other_diagnosis,
     * - cancer_in_family,
     * - chronic_illness,
     * - other_medication,
     * - BMI
     */
    private tPrimary() {
        const stage: string = this.patient.cud_stage_info;
        const progm: string = this.patient.progression_detection_method;
        const has_stage: boolean = stage ? true : false;
        const has_progm: boolean = progm ? true : false;

        const bmi: number = Math.round(
            this.patient.weight / (this.patient.height / 100) ** 2
        );

        return html`
                    <div id="patient-primary">
                        <p id="patient-primary-therapy">
                            <span id="cud_treatment_strategy">${
                                this.patient.cud_treatment_strategy
                            }</span>
                            <span id="cud_primary_therapy_outcome">${
                                this.patient.cud_primary_therapy_outcome
                            }</span>
                            <span id="cud_current_treatment_phase">${
                                this.patient.cud_current_treatment_phase
                            }</span>
                            <span id="maintenance_therapy">${
                                this.patient.maintenance_therapy
                            }</span>
                        </p>
                        <p id="patient-primary-stage">
                            ${
                                has_stage
                                    ? html`<span id="patient-cud_stage_info"
                                          >${stage}</span
                                      >`
                                    : ""
                            }
                            ${
                                has_progm
                                    ? html`<span id="patient-cud_progm_info"
                                          >${progm}</span
                                      >`
                                    : ""
                            }
                        </p>
                        <p id="patient-primary-info">${
                            this.patient.extra_patient_info
                        }</p>
                        <p id="patient-primary-other">
                            <span id="other_diagnosis">${
                                this.patient.other_diagnosis
                            }</span>
                            <span id="cancer_in_family">${
                                this.patient.cancer_in_family
                            }</span>
                            <span id="chronic_illness">${
                                this.patient.chronic_illness
                            }</span>
                            <span id="other_medication">${
                                this.patient.other_medication
                            }</span>
                        </p>
                        <p id="patient-primary-more"></p>
                            BMI: <span id="bmi">${bmi}</span><span class="unit"> kg/m²</span>
                        </p>
                    </div> <!-- patient-primary -->
        `;
    }

    /** Template of the secondary section.
     *
     * Display boolean variables:
     * - has_response_ct,
     * - has_ctdna,
     * - has_petct,
     * - has_wgs,
     * - has_singlecell,
     * - has_germline_control,
     * - has_paired_freshsample,
     * - has_brca_mutation,
     * - has_hrd.
     */
    private tSecondary() {
        return html`
                    <div id="patient-secondary">
                        <ul>
                            <li class=${
                                this.patient.has_response_ct ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_response_ct}
                                    >has ${
                                        this.patient.has_response_ct
                                            ? ""
                                            : html`<em>not</em>`
                                    } response CT</input></li>
                            <li class=${
                                this.patient.has_ctdna ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_ctdna}
                                    >has ${
                                        this.patient.has_ctdna
                                            ? ""
                                            : html`<em>not</em>`
                                    } CTDNA</input></li>
                            <li class=${
                                this.patient.has_petct ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_petct}
                                    >has ${
                                        this.patient.has_petct
                                            ? ""
                                            : html`<em>not</em>`
                                    } PETCT</input></li>
                            <li class=${
                                this.patient.has_wgs ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_wgs}
                                    >has ${
                                        this.patient.has_wgs
                                            ? ""
                                            : html`<em>not</em>`
                                    } WGS</input></li>
                            <li class=${
                                this.patient.has_singlecell ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_singlecell}
                                    >has ${
                                        this.patient.has_singlecell
                                            ? ""
                                            : html`<em>not</em>`
                                    } single-cell</input></li>
                            <li class=${
                                this.patient.has_germline_control
                                    ? "true"
                                    : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${
                                        this.patient.has_germline_control
                                    }
                                    >has ${
                                        this.patient.has_germline_control
                                            ? ""
                                            : html`<em>not</em>`
                                    } germline control</input></li>
                            <li class=${
                                this.patient.has_paired_freshsample
                                    ? "true"
                                    : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${
                                        this.patient.has_paired_freshsample
                                    }
                                    >has ${
                                        this.patient.has_paired_freshsample
                                            ? ""
                                            : html`<em>not</em>`
                                    } paired freshsample</input></li>
                            <li class=${
                                this.patient.has_brca_mutation
                                    ? "true"
                                    : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_brca_mutation}
                                    >has ${
                                        this.patient.has_brca_mutation
                                            ? ""
                                            : html`<em>not</em>`
                                    } BRCA mutation</input></li>
                            <li class=${
                                this.patient.has_hrd ? "true" : "false"
                            }>
                                <input type="checkbox" disabled="disabled"
                                    ?checked=${this.patient.has_hrd}
                                    >has ${
                                        this.patient.has_hrd
                                            ? ""
                                            : html`<em>not</em>`
                                    } HRD</input></li>
                        </ul>
                    </div> <!-- patient-secondary -->
            `;
    }

    /** Template of the tertiary section.
     *
     * Display:
     * - timeseries
     */
    private tTertiary() {
        return html`
            <div id="patient-tertiary">
                <!-- <div>Time series:</div> -->
                <plot-manager
                    time-series=${JSON.stringify(this.patient.time_series)}
                ></plot-manager>
            </div>
        `;
    }
    /** Template for the footer section.
     *
     * (Empty for now).
     */
    private tFooter() {
        return html`
            <div id="patient-footer"></div>
            <!-- patient-footer -->
        `;
    }

    /** Encapsulated CSS style. */
    static styles = css`
        .widget-title {
            display: none;
        }

        img {
            height: 2ex;
        }

        #patient-card {
            margin: 2em;
            padding: 1em;
            border: thin solid grey;
            box-shadow: 3px 3px 8px grey;
            min-width: fit-content;
            background-color: white;
        }

        #patient-header {
        }

        #patient-main {
            font-size: 90%;
        }

        .patient-main-item {
            margin-left: 0.5em;
            font-weight: bold;
        }

        #patient-name {
            font-size: 100%;
        }

        #patient-age {
        }

        #patient-age::after {
            content: " — ";
        }

        #patient-primary-therapy {
            font-weight: bold;
        }

        #patient-cud_histology {
        }

        #patient-cud_stage {
        }
        #patient-cud_stage::before {
            content: " (";
        }
        #patient-cud_stage::after {
            content: ")";
        }

        #patient-info {
            font-size: 85%;
            margin: 0.5em 0.5em 0.5em 1em;
        }

        #patient-primary {
            font-size: 80%;
            border: thin solid #ddd;
            padding: 1em;
            margin: 1em;
        }

        .patient-primary-item {
            margin: 0.5em;
        }

        .patient-primary-item span {
            margin-left: 0.2em;
            vertical-align: text-top;
        }

        #patient-secondary {
            font-size: 75%;
            border: thin solid #ddd;
            padding: 1em;
            margin: 1em;
        }

        #patient-tertiary {
            font-size: 75%;
            border: thin solid #ddd;
            padding: 1em;
            margin: 1em;
        }

        #patient-secondary ul {
            list-style-type: none;
        }

        #patient-secondary ul li {
        }

        .patient-secondary-item {
            text-align: right;
        }

        .false {
            font-weight: normal;
            color: grey;
        }
        .true {
            font-weight: bold;
            color: black;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "oncodash-patient-card": ODPatientCard;
    }
}
