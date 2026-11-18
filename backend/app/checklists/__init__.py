"""Pre-escalation checklists.

ASSUMPTION: the dataset does not say what engineering needs for each category.
These lists are a first draft written from the category names and the return
reasons in the data. Week 1 of the plan is to rewrite them with engineering.
"""

from .categories import BY_CATEGORY
from .common import COMMON
from .logic import checklist_for, missing_items

__all__ = ["BY_CATEGORY", "COMMON", "checklist_for", "missing_items"]
