class Message {
  role "user" | "assistant" | "system"
  content string
}

function Chat(messages: Message[]) -> string {
  client "Locals"
  prompt #"
    {% for m in messages %}
    {{ _.role(m.role)}}
    {{m.content}}
    {% endfor %}
  "#
}

test TestName {
  functions [Chat]
  args {
    messages [
      {
        role "user"
        content "Hello!"
      },
      {
        role "assistant"
        content "Hello, how can I help you?"
      },
      {
        role "user"
        content "help me understand Chobani's success"
      }
    ]
  }
}
