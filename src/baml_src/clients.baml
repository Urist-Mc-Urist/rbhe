client<llm> LMS {
  provider openai-generic
  options {
    base_url "http://localhost:1234/v1"
    model "llamqwen3-4b-instruct-2507a4"
    default_role "user" // Most local models prefer the user role
    // No API key needed for local Ollama
  }
}

client<llm> LlamaCPP {
  provider openai-generic
  options {
    base_url "http://localhost:8080/v1"
    model "llamqwen3-4b-instruct-2507"
    default_role "user" // Most local models prefer the user role
    // No API key needed for local Ollama
  }
}

// https://docs.boundaryml.com/docs/snippets/clients/fallback
client<llm> Locals {
  provider fallback
  options {
    // This will try the clients in order until one succeeds
    strategy [LMS, LlamaCPP]
  }
}
