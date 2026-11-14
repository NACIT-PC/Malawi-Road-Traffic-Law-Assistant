"use strict";

const insufficientEvidenceMessage =
    "I couldn't find enough verified legal information to answer this reliably. I won't guess the applicable rule or fine. Review the available legal sources or consult the relevant official authority.";

function element(tagName, className, text) {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function safeHttpUrl(value) {
    if (!value) return null;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
        return null;
    }
}

function citationLink(citation) {
    const link = element("a", "citation-link", `${citation.title}  ${citation.provision}`);
    const officialUrl = safeHttpUrl(citation.url);
    if (officialUrl) {
        link.href = officialUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    } else {
        link.href = `/legal-sources.html?source=${encodeURIComponent(citation.source_id)}`;
    }
    return link;
}

const answerStates = {
    supported: "Evidence found",
    insufficient_evidence: "Insufficient evidence",
    conflicting_sources: "Sources conflict",
    possibly_outdated: "Source may be outdated",
    needs_clarification: "More detail needed",
    technical_failure: "Technical problem",
};

// The backend writes evidence labels like [E3] in the answer text and lists citations in the
// order the labels first appear, so the nth distinct label is citation n in the list below.
function answerParagraph(text) {
    const node = element("p", "answer-text");
    const order = [];
    text.split(/(\[E\d+\])/g).forEach((part) => {
        const match = /^\[E(\d+)\]$/.exec(part);
        if (!match) {
            if (part) node.append(document.createTextNode(part));
            return;
        }
        if (!order.includes(match[1])) order.push(match[1]);
        node.append(element("sup", "citation-marker", `[${order.indexOf(match[1]) + 1}]`));
    });
    return node;
}

function addAnswer(parent, question, answer) {
    const questionCard = element("article", "message message-user");
    questionCard.append(element("h2", "message-label", "Your question"));
    questionCard.append(element("p", "", question));
    parent.append(questionCard);

    const answerCard = element("article", "message message-assistant");
    const stateLabel = answerStates[answer.state] || "Answer";
    answerCard.append(element("h2", "message-label", stateLabel));
    const directAnswer = answer.direct_answer ||
        (answer.state === "insufficient_evidence" ? insufficientEvidenceMessage : "");
    answerCard.append(answerParagraph(directAnswer));

    if (answer.explanation) answerCard.append(answerParagraph(answer.explanation));

    if (answer.penalty) {
        const penalty = element("p", "penalty", `Penalty information: ${answer.penalty}`);
        answerCard.append(penalty);
    }

    if (answer.qualifications && answer.qualifications.length) {
        const qualifications = element("section", "answer-section");
        qualifications.append(element("h3", "", "Important qualifications"));
        const list = element("ul");
        answer.qualifications.forEach((item) => list.append(element("li", "", item)));
        qualifications.append(list);
        answerCard.append(qualifications);
    }

    if (answer.official_next_step) {
        const nextStep = element("section", "answer-section");
        nextStep.append(element("h3", "", "Possible next step"));
        nextStep.append(element("p", "", answer.official_next_step));
        answerCard.append(nextStep);
    }

    if (answer.citations && answer.citations.length) {
        const sources = element("section", "answer-section");
        sources.append(element("h3", "", "Sources cited"));
        const list = element("ol", "citation-list");
        answer.citations.forEach((citation) => {
            const item = element("li");
            item.append(citationLink(citation));
            if (citation.version) item.append(element("span", "source-meta", `Version: ${citation.version}`));
            if (citation.last_verified) item.append(element("span", "source-meta", `Last verified: ${citation.last_verified}`));
            list.append(item);
        });
        sources.append(list);
        answerCard.append(sources);
    }

    if (answer.verification_note) {
        answerCard.append(element("p", "verification-note", answer.verification_note));
    }
    if (answer.request_id) {
        answerCard.append(element("p", "request-id", `Reference: ${answer.request_id}`));
    }
    addReportForm(answerCard, answer.request_id);
    parent.append(answerCard);
}

function addReportForm(parent, answerId) {
    const details = element("details", "report-details");
    const summary = element("summary", "", "Report a problem with this answer");
    details.append(summary);
    const form = element("form", "report-form");
    const categoryLabel = element("label", "", "What should be reviewed?");
    const category = element("select");
    category.name = "category";
    [
        ["incorrect_answer", "Answer may be incorrect"],
        ["incorrect_citation", "Citation may be incorrect"],
        ["broken_source_link", "Source link may be broken"],
    ].forEach(([value, label]) => {
        const option = element("option", "", label);
        option.value = value;
        category.append(option);
    });
    categoryLabel.append(category);
    form.append(categoryLabel);

    const noteLabel = element("label", "", "Optional note (do not include personal information)");
    const note = element("textarea");
    note.name = "note";
    note.rows = 2;
    note.maxLength = 1000;
    noteLabel.append(note);
    form.append(noteLabel);

    const submit = element("button", "", "Submit report");
    submit.type = "submit";
    form.append(submit);
    const status = element("p", "field-help");
    status.setAttribute("role", "status");
    form.append(status);
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        submit.disabled = true;
        status.textContent = "Submitting…";
        const payload = {
            category: category.value,
            answer_id: answerId || null,
            note: note.value.trim() || null,
        };
        try {
            const response = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) {
                status.textContent = body.error?.message || `Report could not be submitted (HTTP ${response.status}).`;
                return;
            }
            status.textContent = "Report submitted.";
        } catch {
            status.textContent = "Could not connect to the service. The report was not submitted.";
        } finally {
            submit.disabled = false;
        }
    });
    details.append(form);
    parent.append(details);
}

async function submitQuestion(form, question, answerArea) {
    const submit = form.querySelector('button[type="submit"]');
    const previousLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = "Getting answer…";
    const loading = element("p", "status-message", "Searching the available legal sources…");
    loading.setAttribute("role", "status");
    answerArea.append(loading);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40000);
    try {
        const response = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
            signal: controller.signal,
        });
        const body = await response.json().catch(() => ({}));
        loading.remove();
        if (!response.ok) {
            const detail = body.error?.message || `The request could not be completed (HTTP ${response.status}).`;
            const error = element("p", "notice notice-error", detail);
            if (body.error?.request_id) error.append(element("span", "request-id", `Reference: ${body.error.request_id}`));
            answerArea.append(error);
            return;
        }
        addAnswer(answerArea, question, body);
    } catch (error) {
        loading.remove();
        const message = error.name === "AbortError"
            ? "The service took too long to respond. No legal answer was confirmed. Please try again."
            : "Could not connect to the legal information service. No legal answer was confirmed.";
        answerArea.append(element("p", "notice notice-error", message));
    } finally {
        clearTimeout(timer);
        submit.disabled = false;
        submit.textContent = previousLabel;
    }
}

function setupQuestionForms() {
    document.querySelectorAll("[data-ask-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = form.elements.namedItem("question");
            const question = input.value.trim();
            if (!question) {
                input.focus();
                return;
            }
            const area = document.querySelector("[data-conversation], [data-answer-area]");
            if (!area) return;
            area.closest(".chat-panel")?.querySelector(".chat-welcome")?.remove();
            submitQuestion(form, question, area);
            input.value = "";
        });
    });
    document.querySelectorAll("[data-question]").forEach((button) => {
        button.addEventListener("click", () => {
            const form = button.closest(".card")?.querySelector("[data-ask-form]");
            const input = form?.elements.namedItem("question");
            if (!form || !input) return;
            input.value = button.dataset.question;
            input.focus();
        });
    });
}

function appendMetadata(parent, label, value) {
    if (value) parent.append(element("p", "source-meta", `${label}: ${value}`));
}

function renderSourceDetail(detailArea, source) {
    detailArea.replaceChildren();
    detailArea.append(element("h2", "", source.title));
    appendMetadata(detailArea, "Issuer", source.issuer);
    appendMetadata(detailArea, "Verification", source.verification_status);
    appendMetadata(detailArea, "Validity", source.validity_status);
    appendMetadata(detailArea, "Version", source.version);
    appendMetadata(detailArea, "Effective from", source.effective_from);
    appendMetadata(detailArea, "Effective to", source.effective_to);
    appendMetadata(detailArea, "Last verified", source.last_verified);
    const officialUrl = safeHttpUrl(source.url);
    if (officialUrl) {
        const link = element("a", "button-link", "Open source document");
        link.href = officialUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        detailArea.append(link);
    }
    if (source.provisions && source.provisions.length) {
        detailArea.append(element("h3", "provision-heading", "Available provisions"));
        source.provisions.forEach((provision) => {
            const section = element("section", "provision");
            section.append(element("h4", "", `${provision.provision}  ${provision.topic}`));
            section.append(element("p", "", provision.text));
            if (provision.penalty) section.append(element("p", "source-meta", `Penalty recorded: ${provision.penalty}`));
            if (provision.conditions?.length) {
                const list = element("ul");
                provision.conditions.forEach((condition) => list.append(element("li", "", condition)));
                section.append(list);
            }
            detailArea.append(section);
        });
    } else {
        detailArea.append(element("p", "muted", "No provision details are available for this source."));
    }
}

async function setupSources() {
    const list = document.querySelector("[data-source-list]");
    const detailArea = document.querySelector("[data-source-detail]");
    const status = document.querySelector("[data-sources-status]");
    if (!list || !detailArea || !status) return;
    try {
        const response = await fetch("/api/sources");
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error?.message || `Source request failed (HTTP ${response.status}).`);
        list.replaceChildren();
        const sources = body.sources || [];
        if (!sources.length) {
            status.textContent = "No source records are currently available from the backend.";
            return;
        }
        status.textContent = `${sources.length} source record${sources.length === 1 ? "" : "s"} available.`;
        sources.forEach((source) => {
            const button = element("button", "source-item", source.title);
            button.type = "button";
            button.dataset.sourceId = source.source_id;
            button.addEventListener("click", async () => {
                detailArea.replaceChildren(element("p", "status-message", "Loading source details…"));
                try {
                    const detailResponse = await fetch(`/api/sources/${encodeURIComponent(source.source_id)}`);
                    const detailBody = await detailResponse.json().catch(() => ({}));
                    if (!detailResponse.ok) throw new Error(detailBody.error?.message || `Source detail request failed (HTTP ${detailResponse.status}).`);
                    renderSourceDetail(detailArea, detailBody);
                } catch (error) {
                    detailArea.replaceChildren(element("p", "notice notice-error", error.message));
                }
            });
            list.append(button);
        });
        const selectedSource = new URLSearchParams(window.location.search).get("source");
        if (selectedSource) {
            const button = [...list.querySelectorAll("button")].find((item) =>
                item.dataset.sourceId === selectedSource
            );
            const source = sources.find((item) => item.source_id === selectedSource);
            if (source) {
                const detailResponse = await fetch(`/api/sources/${encodeURIComponent(source.source_id)}`);
                const detailBody = await detailResponse.json().catch(() => ({}));
                if (!detailResponse.ok) throw new Error(detailBody.error?.message || `Source detail request failed (HTTP ${detailResponse.status}).`);
                renderSourceDetail(detailArea, detailBody);
                if (button) button.focus();
            }
        }
    } catch (error) {
        status.textContent = error.message || "Could not load legal source records.";
    }
}

setupQuestionForms();
setupSources();
