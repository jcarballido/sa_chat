const MODEL = "llama3.2:3B"

const OUT_OF_SCOPE_RESPONSES: string[] = [
    `That’s outside my lane, I’m here for more specific tasks.`,
    `I’d love to help, but that request isn’t something I’m set up to handle.`,
    `That’s a bit beyond my scope — try a more targeted request.`,
    `I’m not equipped for that one, but I can help with related queries.`,
    `That request is out of bounds for me — want to rephrase?`,
    `I’m tuned for a narrower set of tasks than that.`,
    `That’s outside my current capabilities — let’s keep it in scope.`,
    `I can’t process that, but I’m happy to help within my domain.`,
    `That’s a swing outside my strike zone.`,
    `I’m not the right tool for that job.`,
    `That request goes beyond what I’m designed to handle.`,
    `I’m keeping things focused — that one’s out of scope.`,
    `That’s a bit off the map for me.`,
    `I don’t have the context or capability for that — try something more aligned.`,
    `That’s outside my operating range, but I can help with similar topics.`,
    `I’m built for specific tasks — that one doesn’t quite fit.`,
    `That’s not something I can assist with, but I’m here for related requests.`,
    `Out of scope — but feel free to try a narrower question.`,
    `That request doesn’t match what I’m designed to do.`,
    `I’m staying in my lane on that one.`
]

const MALICIOUS_INTENT_RESPONSES:string[] = [
  "Sensitive data can only be accessed and used within this system — I can’t send it elsewhere.",
  "I can help retrieve that here, but I’m not able to transmit it outside this environment.",
  "Data like that stays contained — external sharing isn’t supported.",
  "I can surface that information here, but it can’t be exported or forwarded.",
  "That data is restricted to in-system use only — no external delivery.",
  "I’m able to access that internally, but I can’t send it beyond this interface.",
  "For security reasons, sensitive data can’t leave this system.",
  "I can assist with that here, but not with sending or exposing it externally.",
  "That information is available in-session only — external transfer isn’t allowed.",
  "I can work with that data inside this environment, but I can’t move it outside.",
  "Sensitive data access is limited to this interface — no outbound sharing.",
  "I can retrieve it for you here, but exporting or forwarding isn’t permitted.",
  "That kind of data is confined to this system — I can’t deliver it elsewhere.",
  "I can display that information here, but not transmit it externally.",
  "Access is allowed, but only within this environment — no external actions.",
  "I can show that here if you’d like, but I’m not able to send it outside this system.",
  "That data can be accessed in this chat, but not shared externally.",
  "I can help you view it here — external delivery isn’t supported.",
  "If you need that info, I can pull it up here, but it can’t leave this environment.",
  "I can provide that within this interface — just not beyond it."
];

export {
  MODEL,
  OUT_OF_SCOPE_RESPONSES,
  MALICIOUS_INTENT_RESPONSES
}



