
from graphviz import Digraph

# ==============================
# ER Diagram Builder (Template)
# ==============================

dot = Digraph(
    name="BookSpace_ER_Diagram",
    format="png",
    graph_attr={"rankdir": "TB", "splines": "ortho"},
    node_attr={"fontname": "Helvetica"},
    edge_attr={"fontname": "Helvetica"}
)

# ==============================
# Helper Functions
# ==============================

def entity(name, attributes):
    """Strong entity"""
    label = f"<<TABLE BORDER='1' CELLBORDER='0' CELLSPACING='0'>"
    label += f"<TR><TD><B>{name}</B></TD></TR>"
    for attr in attributes:
        label += f"<TR><TD ALIGN='LEFT'>{attr}</TD></TR>"
    label += "</TABLE>>"
    dot.node(name, label=label, shape="plaintext")

def weak_entity(name, attributes):
    """Weak entity (double border)"""
    label = f"<<TABLE BORDER='2' CELLBORDER='0' CELLSPACING='0'>"
    label += f"<TR><TD><B>{name}</B></TD></TR>"
    for attr in attributes:
        label += f"<TR><TD ALIGN='LEFT'>{attr}</TD></TR>"
    label += "</TABLE>>"
    dot.node(name, label=label, shape="plaintext")

def relationship(name, identifying=False):
    """Relationship diamond"""
    shape = "diamond"
    peripheries = "2" if identifying else "1"
    dot.node(
        name,
        label=name,
        shape=shape,
        peripheries=peripheries
    )

def connect(left, rel, right, left_card="", right_card=""):
    """Connect entities via relationship with cardinalities"""
    dot.edge(left, rel, label=left_card)
    dot.edge(rel, right, label=right_card)

# ==============================
# ENTITIES
# ==============================

entity("Registration", [
    "UserID (PK)",
    "Name",
    "Email",
    "Password",
    "Description",
    "More.."
])

entity("Completed_Books", [
    "UserID",
    "BookID",
    "Completed_Date"
])

entity("FeedBack", [
    "UserID",
    "BookID",
    "Rating",
    "Comment",
    "Upvote"
])

entity("Library", [
    "UserID",
    "BookID",
    "BookMark",
    "LastRead",
])

entity("History",[
    "UserID",
    "BookID",
    "BookMark",
    "LastAcessed"
])

entity("Books", [
    "BookID",
    "BookName",
    "Author",
    "Genre",
    "Description",
    "Avg_Rating",
    "Status",
    "Reader_Count",
])
# ==============================
# RELATIONSHIPS
# ==============================

relationship("Has_Completed")
relationship("Has_Seen")
relationship("Gave_Feedback")
relationship("His_Library")

relationship("Has_CompletedBooks")

relationship("Have_Book")
relationship("Have_Feedback")
relationship("Have_Searched")

# ==============================
# CONNECTIONS + CARDINALITIES
# ==============================

connect("Registration","Has_Completed","Completed_Books","1","N")
connect("Registration","Gave_Feedback","FeedBack","1","N")
connect("Registration","Has_Seen","History","1","N")
connect("Registration","His_Library","Library","1","N")

connect("Completed_Books","Has_CompletedBooks","Books","N","1")

connect("FeedBack","Have_Feedback","Books","N","1")
connect("Library","Have_Book","Books","1","N")
connect("History","Have_Searched","Books","1","N")
# ==============================
# RENDER
# ==============================
dot.render("Project_ER", cleanup=True)
er.py
