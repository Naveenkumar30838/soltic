from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt
from langgraph.checkpoint.memory import MemorySaver

class State(TypedDict):
    task:str
    feedback: str

def agent(state:State):
    print("About to Start working, Let me ask for user input first : ")

    response = interrupt("Have You Booked tickets")

    print("user said " , response)
    return {"feedback":response}


builder = StateGraph(State)

builder.add_node(agent, "agent")
builder.add_edge(START, "agent")
builder.add_edge( "agent" , END)

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)

