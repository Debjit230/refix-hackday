/* =========================================================
   RE:FIX — AI-POWERED SMART DIAGNOSIS ENGINE
   Step 2E
   Static frontend + Vercel AI backend
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     DEVICE PROFILES
  ======================================================= */

  const profiles = {

    phone: {
      name: "Smartphone",
      base: 88,
      waste: 180,
      replacement: 12000,

      costs: {
        battery: "₹500–₹1,500",
        heat: "₹800–₹2,500",
        screen: "₹2,000–₹6,000",
        power: "₹1,000–₹4,000",
        slow: "₹0–₹1,500",
        physical: "₹1,000–₹5,000"
      }
    },

    laptop: {
      name: "Laptop",
      base: 84,
      waste: 2000,
      replacement: 45000,

      costs: {
        battery: "₹1,500–₹4,000",
        heat: "₹1,000–₹4,000",
        screen: "₹4,000–₹12,000",
        power: "₹2,000–₹8,000",
        slow: "₹1,000–₹8,000",
        physical: "₹2,000–₹10,000"
      }
    },

    tablet: {
      name: "Tablet",
      base: 86,
      waste: 420,
      replacement: 18000,

      costs: {
        battery: "₹800–₹2,500",
        heat: "₹1,000–₹3,000",
        screen: "₹2,500–₹7,000",
        power: "₹1,500–₹5,000",
        slow: "₹500–₹2,000",
        physical: "₹1,500–₹6,000"
      }
    },

    headphones: {
      name: "Headphones / Earbuds",
      base: 76,
      waste: 90,
      replacement: 4000,

      costs: {
        battery: "₹300–₹1,000",
        heat: "₹300–₹1,000",
        screen: "₹0–₹500",
        power: "₹300–₹1,500",
        slow: "₹0–₹500",
        physical: "₹300–₹1,500"
      }
    },

    charger: {
      name: "Charger / Adapter",
      base: 70,
      waste: 90,
      replacement: 1500,

      costs: {
        battery: "₹200–₹600",
        heat: "₹300–₹800",
        screen: "₹0–₹300",
        power: "₹200–₹700",
        slow: "₹0–₹300",
        physical: "₹200–₹800"
      }
    },

    other: {
      name: "Other electronics",
      base: 68,
      waste: 350,
      replacement: 5000,

      costs: {
        battery: "₹300–₹1,500",
        heat: "₹500–₹2,000",
        screen: "₹500–₹3,000",
        power: "₹500–₹2,500",
        slow: "₹300–₹1,500",
        physical: "₹500–₹3,000"
      }
    }

  };


  /* =======================================================
     PROBLEM ADJUSTMENTS
  ======================================================= */

  const problemAdjustments = {
    battery: 0,
    heat: -8,
    screen: -14,
    power: -18,
    slow: 2,
    physical: -16
  };


  /* =======================================================
     PROBLEM INFORMATION
  ======================================================= */

  const problemInfo = {

    battery: {
      label: "Battery issue",
      repairability: 88,
      difficulty: "Easy",
      difficultyClass: "easy",

      reason:
        "Battery-related problems are often repairable without replacing the entire device.",

      action:
        "Check battery health and get a replacement battery quote."
    },

    heat: {
      label: "Overheating",
      repairability: 72,
      difficulty: "Medium",
      difficultyClass: "medium",

      reason:
        "Overheating can often be caused by dust, thermal issues, blocked airflow, or aging components.",

      action:
        "Clean the device, check airflow and thermal condition, then get a diagnostic check."
    },

    screen: {
      label: "Screen problem",
      repairability: 65,
      difficulty: "Medium",
      difficultyClass: "medium",

      reason:
        "A damaged display can often be replaced, but the repair cost depends heavily on the device.",

      action:
        "Get a screen replacement quote before buying a new device."
    },

    power: {
      label: "Power problem",
      repairability: 55,
      difficulty: "Hard",
      difficultyClass: "hard",

      reason:
        "Power failures can come from batteries, charging circuits, connectors, or deeper board-level faults.",

      action:
        "Have the charging and power circuits professionally diagnosed."
    },

    slow: {
      label: "Slow performance",
      repairability: 92,
      difficulty: "Easy",
      difficultyClass: "easy",

      reason:
        "Slow performance can often be improved through storage cleanup, software maintenance, upgrades, or resets.",

      action:
        "Clean storage, remove unnecessary software and check whether an upgrade is possible."
    },

    physical: {
      label: "Physical damage",
      repairability: 60,
      difficulty: "Medium",
      difficultyClass: "medium",

      reason:
        "Physical damage may be repairable, but the extent of internal damage needs to be checked.",

      action:
        "Inspect the physical damage and request a repair estimate before replacing the device."
    }

  };


  /* =======================================================
     CONDITION STATE
  ======================================================= */

  let selectedCondition = "working";

  const conditionButtons =
    document.querySelectorAll(".condition-btn");

  conditionButtons.forEach((button) => {

    button.addEventListener("click", () => {

      conditionButtons.forEach((btn) =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      selectedCondition =
        button.dataset.condition || "working";

    });

  });


  /* =======================================================
     DOM ELEMENTS
  ======================================================= */

  const diagnosisForm =
    document.getElementById("diagnosisForm");

  const resultEmpty =
    document.getElementById("resultEmpty");

  const resultContent =
    document.getElementById("resultContent");

  const resultTitle =
    document.getElementById("resultTitle");

  const resultSummary =
    document.getElementById("resultSummary");

  const confidence =
    document.getElementById("confidence");

  const repairScore =
    document.getElementById("repairScore");

  const repairBar =
    document.getElementById("repairBar");

  const waste =
    document.getElementById("waste");

  const actionBadge =
    document.getElementById("actionBadge");

  const recIcon =
    document.getElementById("recIcon");

  const nextAction =
    document.getElementById("nextAction");

  const diagnosisExtras =
    document.getElementById("diagnosisExtras");


  /* =======================================================
     RULE-BASED SCORING
  ======================================================= */

  function calculateScore(
    device,
    problem,
    age,
    condition
  ) {

    const profile = profiles[device];

    if (!profile) {
      return 50;
    }

    let score =
      profile.base +
      (problemAdjustments[problem] || 0);


    /* Condition */

    if (condition === "partial") {
      score -= 8;
    }

    if (condition === "dead") {
      score -= 25;
    }


    /* Age */

    if (age === "1") {
      score += 5;
    }

    if (age === "2") {
      score += 2;
    }

    if (age === "4") {
      score -= 5;
    }

    if (age === "6") {
      score -= 12;
    }


    /* Special cases */

    if (
      problem === "slow" &&
      condition !== "dead"
    ) {
      score += 5;
    }

    if (
      problem === "battery" &&
      condition === "working"
    ) {
      score += 4;
    }

    if (
      problem === "power" &&
      condition === "dead"
    ) {
      score -= 8;
    }


    return Math.max(
      10,
      Math.min(96, score)
    );

  }


  /* =======================================================
     RECOMMENDATION
  ======================================================= */

  function getRecommendation(
    score,
    age,
    condition,
    problem
  ) {

    if (
      score < 48 ||
      (condition === "dead" && age === "6")
    ) {
      return "RECYCLE";
    }

    if (score < 67) {
      return "REUSE";
    }

    return "REPAIR";

  }


  /* =======================================================
     CONFIDENCE
  ======================================================= */

  function calculateConfidence(
    score,
    condition,
    problem,
    age
  ) {

    let confidenceValue = 82;

    if (score >= 80 || score <= 35) {
      confidenceValue += 7;
    }

    if (condition === "dead") {
      confidenceValue += 3;
    }

    if (
      problem === "battery" ||
      problem === "slow"
    ) {
      confidenceValue += 3;
    }

    if (age === "6") {
      confidenceValue += 2;
    }

    return Math.min(
      97,
      confidenceValue
    );

  }


  /* =======================================================
     COST + SAVING
  ======================================================= */

  function calculateSaving(
    device,
    score,
    recommendation
  ) {

    const replacement =
      profiles[device].replacement;

    if (recommendation === "RECYCLE") {
      return 0;
    }

    if (recommendation === "REUSE") {
      return Math.round(
        replacement * 0.45
      );
    }

    const saving =
      replacement *
      Math.min(
        0.75,
        Math.max(
          0.25,
          score / 100
        )
      );

    return Math.round(saving);

  }


  /* =======================================================
     DIFFICULTY
  ======================================================= */

  function getDifficulty(
    problem,
    condition
  ) {

    const info =
      problemInfo[problem];

    let difficulty =
      info?.difficulty || "Medium";

    let difficultyClass =
      info?.difficultyClass || "medium";

    if (
      condition === "dead" &&
      problem !== "slow"
    ) {

      difficulty = "Hard";
      difficultyClass = "hard";

    }

    return {
      difficulty,
      difficultyClass
    };

  }


  /* =======================================================
     ESCAPE HTML
  ======================================================= */

  function escapeHTML(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     RULE-BASED RESULT EXTRAS
  ======================================================= */

  function buildExtras({
    recommendation,
    device,
    problem,
    score,
    age,
    condition,
    saving,
    repairCost,
    wasteValue
  }) {

    const info =
      problemInfo[problem];

    const difficulty =
      getDifficulty(
        problem,
        condition
      );

    let reason =
      info?.reason ||
      "The result is based on the information provided.";

    let icon = "🔧";

    if (recommendation === "REUSE") {

      icon = "♻️";

      reason =
        "The device may still have useful value. Reusing, donating, or repurposing it can extend its life and avoid unnecessary e-waste.";

    }

    if (recommendation === "RECYCLE") {

      icon = "♻️";

      reason =
        "The estimated repairability is relatively low for this device condition and age, so responsible recycling can prevent the device from becoming unmanaged e-waste.";

    }

    let action =
      info?.action ||
      "Get the device professionally checked.";

    if (recommendation === "REUSE") {

      action =
        "Back up your data, securely reset the device and consider donating, selling, or repurposing it.";

    }

    if (recommendation === "RECYCLE") {

      action =
        "Back up your data, remove personal accounts and take the device to an authorized e-waste collection point.";

    }


    diagnosisExtras.innerHTML = `

      <div class="diagnosis-detail-grid">

        <div class="detail-card">

          <small>WHY THIS RESULT</small>

          <strong>
            ${icon} ${recommendation}
          </strong>

          <p>
            ${escapeHTML(reason)}
          </p>

        </div>


        <div class="detail-card">

          <small>REPAIR DIFFICULTY</small>

          <strong>
            ${escapeHTML(
              difficulty.difficulty
            )}
          </strong>

          <p>
            ${
              difficulty.difficulty === "Easy"
                ? "Usually suitable for a basic service or straightforward replacement."
                : difficulty.difficulty === "Medium"
                ? "May require a technician or device-specific parts."
                : "Likely requires professional diagnosis or specialist repair."
            }
          </p>

        </div>


        <div class="detail-card">

          <small>EST. REPAIR COST</small>

          <strong>
            ${escapeHTML(repairCost)}
          </strong>

          <p>
            Indicative prototype estimate.
            Actual pricing varies by device and location.
          </p>

        </div>


        <div class="detail-card">

          <small>POTENTIAL SAVING</small>

          <strong>
            ₹${Number(saving).toLocaleString("en-IN")}
          </strong>

          <p>
            Estimated avoided replacement value
            if the device remains useful.
          </p>

        </div>


        <div class="detail-card">

          <small>WASTE AVOIDED</small>

          <strong>
            ${Number(wasteValue).toLocaleString("en-IN")} g
          </strong>

          <p>
            Approximate device mass kept in use
            instead of entering the waste stream.
          </p>

        </div>


        <div class="detail-card">

          <small>DEVICE</small>

          <strong>
            ${escapeHTML(
              profiles[device]?.name || device
            )}
          </strong>

          <p>
            ${
              condition === "working"
                ? "Currently working"
                : condition === "partial"
                ? "Partially working"
                : "Not currently working"
            }
          </p>

        </div>

      </div>


      <div class="next-action-card">

        <div class="next-action-icon">
          ${icon}
        </div>

        <div>

          <small>NEXT BEST ACTION</small>

          <strong>
            ${escapeHTML(action)}
          </strong>

        </div>

      </div>

    `;

    return action;

  }


  /* =======================================================
     RULE-BASED RESULT DISPLAY
  ======================================================= */

  function displayResult(data) {

    const {
      recommendation,
      score,
      device,
      problem,
      age,
      condition,
      confidenceValue,
      saving,
      repairCost,
      wasteValue
    } = data;


    let title = "";
    let summary = "";
    let badge = "";
    let icon = "";


    if (recommendation === "REPAIR") {

      title =
        "Repair looks practical.";

      summary =
        "The device has a relatively strong repairability score. Extending its useful life could reduce unnecessary replacement and e-waste.";

      badge =
        "🔧 REPAIR";

      icon = "🔧";

    }


    if (recommendation === "REUSE") {

      title =
        "Consider reuse or donation.";

      summary =
        "The device may still have useful value, but repair economics should be considered before spending more on it.";

      badge =
        "♻️ REUSE";

      icon = "♻️";

    }


    if (recommendation === "RECYCLE") {

      title =
        "Recycling may be the practical route.";

      summary =
        "The estimated repairability is relatively low for the device's current condition and age. Responsible recycling can keep valuable materials in the recovery stream.";

      badge =
        "♻️ RECYCLE";

      icon = "♻️";

    }


    resultTitle.textContent = title;

    resultSummary.textContent = summary;

    confidence.textContent =
      `${confidenceValue}% confidence`;

    repairScore.textContent =
      score;

    waste.textContent =
      wasteValue;

    actionBadge.textContent =
      badge;

    recIcon.textContent =
      icon;


    const info =
      problemInfo[problem];

    nextAction.textContent =
      info?.action ||
      "Get the device professionally checked.";


    repairBar.style.width = "0%";

    requestAnimationFrame(() => {

      setTimeout(() => {

        repairBar.style.width =
          `${score}%`;

      }, 100);

    });


    buildExtras({
      recommendation,
      device,
      problem,
      score,
      age,
      condition,
      saving,
      repairCost,
      wasteValue
    });


    resultEmpty.classList.add(
      "hidden"
    );

    resultContent.classList.remove(
      "hidden"
    );


    resultContent.classList.remove(
      "result-pop"
    );

    void resultContent.offsetWidth;

    resultContent.classList.add(
      "result-pop"
    );


    localStorage.setItem(
      "refixLastResult",
      JSON.stringify(data)
    );

  }


  /* =======================================================
     AI BACKEND REQUEST
  ======================================================= */

  async function requestAIDiagnosis({
    device,
    problem,
    age,
    condition,
    description
  }) {

    const response =
      await fetch(
        "/api/diagnose",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            device,
            problem,
            age,
            condition,
            description
          })
        }
      );


    let data;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        "The AI server returned an invalid response."
      );

    }


    if (!response.ok) {

      throw new Error(
        data.error ||
        "AI diagnosis failed."
      );

    }


    if (
      !data.success ||
      !data.diagnosis
    ) {

      throw new Error(
        "Invalid AI diagnosis response."
      );

    }


    return data.diagnosis;

  }


  /* =======================================================
     AI RESULT DISPLAY
  ======================================================= */

  function displayAIResult(data) {

    const {

      recommendation,
      repairability,
      confidence,
      diagnosis,
      reason,
      difficulty,
      repairCost,
      potentialSaving,
      wasteAvoided,
      nextAction: aiNextAction

    } = data;


    const safeRecommendation =
      ["REPAIR", "REUSE", "RECYCLE"]
        .includes(
          recommendation
        )
        ? recommendation
        : "REPAIR";


    const score =
      Math.max(
        0,
        Math.min(
          100,
          Number(repairability) || 0
        )
      );


    const confidenceValue =
      Math.max(
        50,
        Math.min(
          95,
          Number(confidence) || 50
        )
      );


    const saving =
      Math.max(
        0,
        Number(potentialSaving) || 0
      );


    const wasteValue =
      Math.max(
        0,
        Number(wasteAvoided) || 0
      );


    let title = "";
    let badge = "";
    let icon = "";


    if (
      safeRecommendation === "REPAIR"
    ) {

      title =
        "AI recommends repair.";

      badge =
        "🔧 REPAIR";

      icon = "🔧";

    }


    if (
      safeRecommendation === "REUSE"
    ) {

      title =
        "AI recommends reuse.";

      badge =
        "♻️ REUSE";

      icon = "♻️";

    }


    if (
      safeRecommendation === "RECYCLE"
    ) {

      title =
        "AI recommends recycling.";

      badge =
        "♻️ RECYCLE";

      icon = "♻️";

    }


    resultTitle.textContent =
      title;

    resultSummary.textContent =
      `${diagnosis}. ${reason}`;


    confidence.textContent =
      `${confidenceValue}% AI confidence`;


    repairScore.textContent =
      score;


    waste.textContent =
      wasteValue;


    actionBadge.textContent =
      badge;


    recIcon.textContent =
      icon;


    nextAction.textContent =
      aiNextAction;


    repairBar.style.width =
      "0%";


    requestAnimationFrame(() => {

      setTimeout(() => {

        repairBar.style.width =
          `${score}%`;

      }, 100);

    });


    diagnosisExtras.innerHTML = `

      <div class="ai-status">
        AI-powered diagnosis
      </div>


      <div class="diagnosis-detail-grid">


        <div class="detail-card">

          <small>AI DIAGNOSIS</small>

          <strong>
            ${escapeHTML(diagnosis)}
          </strong>

          <p>
            Generated from your device
            information and problem description.
          </p>

        </div>


        <div class="detail-card">

          <small>WHY THIS RESULT</small>

          <strong>
            ${icon} ${safeRecommendation}
          </strong>

          <p>
            ${escapeHTML(reason)}
          </p>

        </div>


        <div class="detail-card">

          <small>REPAIR DIFFICULTY</small>

          <strong>
            ${escapeHTML(difficulty)}
          </strong>

          <p>
            Difficulty is an estimate based
            on the described problem.
          </p>

        </div>


        <div class="detail-card">

          <small>EST. REPAIR COST</small>

          <strong>
            ${escapeHTML(repairCost)}
          </strong>

          <p>
            Approximate estimate,
            not a service quote.
          </p>

        </div>


        <div class="detail-card">

          <small>POTENTIAL SAVING</small>

          <strong>
            ₹${saving.toLocaleString("en-IN")}
          </strong>

          <p>
            Estimated avoided replacement value.
          </p>

        </div>


        <div class="detail-card">

          <small>WASTE AVOIDED</small>

          <strong>
            ${wasteValue.toLocaleString("en-IN")} g
          </strong>

          <p>
            Approximate device mass
            kept in use.
          </p>

        </div>


      </div>


      <div class="next-action-card">

        <div class="next-action-icon">
          ${icon}
        </div>

        <div>

          <small>NEXT BEST ACTION</small>

          <strong>
            ${escapeHTML(aiNextAction)}
          </strong>

        </div>

      </div>

    `;


    resultEmpty.classList.add(
      "hidden"
    );

    resultContent.classList.remove(
      "hidden"
    );


    resultContent.classList.remove(
      "result-pop"
    );

    void resultContent.offsetWidth;

    resultContent.classList.add(
      "result-pop"
    );


    const savedData = {

      recommendation:
        safeRecommendation,

      score,

      confidenceValue,

      saving,

      wasteValue,

      diagnosis,

      reason,

      difficulty,

      repairCost,

      nextAction:
        aiNextAction,

      timestamp:
        Date.now()

    };


    localStorage.setItem(
      "refixLastResult",
      JSON.stringify(savedData)
    );


    setTimeout(() => {

      document
        .getElementById(
          "diagnosisResult"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

    }, 150);

  }


  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  if (diagnosisForm) {

    diagnosisForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const device =
          document
            .getElementById("device")
            ?.value;


        const problem =
          document
            .getElementById("problem")
            ?.value;


        const age =
          document
            .getElementById("age")
            ?.value;


        const description =
          document
            .getElementById("description")
            ?.value
            ?.trim() || "";


        if (
          !device ||
          !problem ||
          !age
        ) {

          showToast(
            "Please complete the diagnosis form."
          );

          return;

        }


        if (
          description.length < 8
        ) {

          showToast(
            "Please describe the problem in a little more detail."
          );

          document
            .getElementById("description")
            ?.focus();

          return;

        }


        /* -------------------------------------------------
           RULE-BASED FALLBACK DATA
        ------------------------------------------------- */

        const score =
          calculateScore(
            device,
            problem,
            age,
            selectedCondition
          );


        const recommendation =
          getRecommendation(
            score,
            age,
            selectedCondition,
            problem
          );


        const confidenceValue =
          calculateConfidence(
            score,
            selectedCondition,
            problem,
            age
          );


        const saving =
          calculateSaving(
            device,
            score,
            recommendation
          );


        const repairCost =
          profiles[device]
            ?.costs?.[problem] ||
          "₹500–₹2,500";


        const wasteValue =
          profiles[device]
            ?.waste ||
          350;


        const fallbackResult = {

          recommendation,

          score,

          device,

          problem,

          age,

          condition:
            selectedCondition,

          confidenceValue,

          saving,

          repairCost,

          wasteValue,

          timestamp:
            Date.now()

        };


        /* -------------------------------------------------
           AI LOADING STATE
        ------------------------------------------------- */

        diagnosisForm.classList.add(
          "ai-loading"
        );


        const submitButton =
          diagnosisForm.querySelector(
            'button[type="submit"]'
          );


        const originalButtonText =
          submitButton
            ?.textContent;


        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.textContent =
            "AI IS ANALYZING...";

        }


        /* -------------------------------------------------
           CALL AI
        ------------------------------------------------- */

        try {

          const aiResult =
            await requestAIDiagnosis({
              device,
              problem,
              age,
              condition:
                selectedCondition,
              description
            });


          displayAIResult(
            aiResult
          );


        } catch (error) {

          console.error(
            "AI diagnosis error:",
            error
          );


          /*
             AI failed.

             We keep the original
             rule-based engine working
             instead of breaking the website.
          */

          showToast(
            "AI diagnosis unavailable. Showing standard diagnosis."
          );


          displayResult(
            fallbackResult
          );

        } finally {

          diagnosisForm.classList.remove(
            "ai-loading"
          );


          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              originalButtonText ||
              "GET DIAGNOSIS";

          }

        }


        /* -------------------------------------------------
           Scroll to result
        ------------------------------------------------- */

        setTimeout(() => {

          document
            .getElementById(
              "diagnosisResult"
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

        }, 150);

      }
    );

  }


  /* =======================================================
     LOAD PREVIOUS RESULT
  ======================================================= */

  function loadPreviousResult() {

    const saved =
      localStorage.getItem(
        "refixLastResult"
      );


    if (!saved) {
      return;
    }


    try {

      const data =
        JSON.parse(saved);


      if (
        data &&
        data.device &&
        data.problem
      ) {

        /*
          Saved result remains available
          for future dashboard features.
        */

      }

    } catch (error) {

      console.warn(
        "Could not restore saved diagnosis.",
        error
      );

    }

  }


  loadPreviousResult();


  /* =======================================================
     IMPACT CALCULATOR
  ======================================================= */

  const impactInputs =
    document.querySelectorAll(
      ".calculator-panel input[data-kg]"
    );


  const impactTotal =
    document.getElementById(
      "impactTotal"
    );


  const impactBar =
    document.getElementById(
      "impactBar"
    );


  const recoverable =
    document.getElementById(
      "recoverable"
    );


  function updateImpact() {

    let total = 0;


    impactInputs.forEach(
      (input) => {

        const quantity =
          Number(input.value) || 0;


        const kg =
          Number(input.dataset.kg) || 0;


        total +=
          quantity * kg;

      }
    );


    if (impactTotal) {

      impactTotal.textContent =
        total.toFixed(1);

    }


    if (recoverable) {

      const recovery =
        Math.min(
          95,
          Math.round(
            total * 0.72
          )
        );


      recoverable.textContent =
        `${recovery}%`;

    }


    if (impactBar) {

      const width =
        Math.min(
          100,
          total * 3
        );


      impactBar.style.width =
        `${width}%`;

    }

  }


  impactInputs.forEach(
    (input) => {

      input.addEventListener(
        "input",
        updateImpact
      );

    }
  );


  updateImpact();


  /* =======================================================
     RECYCLING BUTTONS
  ======================================================= */

  const circleButtons =
    document.querySelectorAll(
      ".circle-btn"
    );


  circleButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          showToast(
            "Recycling locator demo — connect a local recycling API in the next version."
          );

        }
      );

    }
  );


  /* =======================================================
     TOAST
  ======================================================= */

  const toast =
    document.getElementById(
      "toast"
    );


  function showToast(message) {

    if (!toast) {
      return;
    }


    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      window.__refixToastTimer
    );


    window.__refixToastTimer =
      setTimeout(() => {

        toast.classList.remove(
          "show"
        );

      }, 3000);

  }


  window.showToast =
    showToast;


  /* =======================================================
     SMOOTH NAVIGATION
  ======================================================= */

  window.scrollToSection =
    function (id) {

      const section =
        document.getElementById(id);


      if (!section) {
        return;
      }


      section.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    };


  /* =======================================================
     REVEAL ANIMATIONS
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".reveal"
    );


  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "visible"
                );


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      (element) => {

        observer.observe(element);

      }
    );

  } else {

    revealElements.forEach(
      (element) => {

        element.classList.add(
          "visible"
        );

      }
    );

  }


  /* =======================================================
     HASH NAVIGATION
  ======================================================= */

  function handleHash() {

    const hash =
      window.location.hash.replace(
        "#",
        ""
      );


    if (!hash) {
      return;
    }


    setTimeout(() => {

      scrollToSection(hash);

    }, 100);

  }


  window.addEventListener(
    "hashchange",
    handleHash
  );


  handleHash();


  /* =======================================================
     YEAR
  ======================================================= */

  const yearElements =
    document.querySelectorAll(
      "[data-year]"
    );


  yearElements.forEach(
    (element) => {

      element.textContent =
        new Date().getFullYear();

    }
  );

});