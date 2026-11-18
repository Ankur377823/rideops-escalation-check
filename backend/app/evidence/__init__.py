"""Two honest tests of the tool against the historical data.

predictor_test: can we tell in advance WHICH escalations will bounce?
scenario: if the check prevented a share of each avoidable return, what would
the backlog have looked like? A what-if with stated assumptions.
"""

from .counterfactual import counterfactual_hours
from .predictors import SPLIT, predictor_test
from .whatif import scenario

__all__ = ["SPLIT", "counterfactual_hours", "predictor_test", "scenario"]
