from langgraph.graph import StateGraph,MessagesState,  START, END
from langchain_core.messages import SystemMessage
from langchain_openrouter import ChatOpenRouter
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatOpenRouter(
    model = "openrouter/free",
    api_key = os.getenv("OPENROUTER_API_KEY"),
    temperature = 0.6,
    max_tokens = 2048
)
Travel_Agent_System_prompt = "You are soltic a Travel Agent"
def call_llm(state:MessagesState):
    message = [ (content=Travel_Agent_System_prompt)] + state["messages"]
    response = llm.invoke(message)
    
    return {"messages" : [response]}


graph = StateGraph(MessagesState)

graph.add_node("agent" , call_llm)
graph.add_edge(START , "agent")
graph.add_edge("agent",END)

app = graph.compile()

result = app.invoke({"messages " : [{"role" : "user" , "content":"Plan a Trip to Goa"}]})

print("Agent : " , result["messages"][-1].content)