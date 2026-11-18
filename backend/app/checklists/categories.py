"""Checklist items specific to each ticket category."""

from ..reasons import CONFIG, HOWTO, INFO
from .item import confirm, text

BY_CATEGORY: dict[str, list[dict]] = {
    "Roster / booking not syncing": [
        text("roster_date_shift", INFO, "Roster date and shift affected"),
        text("employee_ids", INFO, "Example employee IDs (at least 2)"),
        confirm("cutoff_config", CONFIG, "Booking cutoff and shift settings checked in client config"),
        confirm("resync", CONFIG, "Manual roster re-sync tried from admin panel"),
    ],
    "Live tracking / GPS incorrect": [
        text("trip_id", INFO, "Trip ID and vehicle number"),
        text("device", INFO, "Driver phone model and app version"),
        confirm("gps_perm", CONFIG, "Driver app location permission and battery saver checked"),
        confirm("geofence", CONFIG, "Client site geofence / pickup pin checked"),
    ],
    "Report export failing": [
        text("report_name", INFO, "Report name, date range and format"),
        text("user_role", INFO, "User who ran it and their role"),
        confirm("smaller_range", CONFIG, "Retried with a smaller date range"),
        confirm("schedule_cfg", CONFIG, "Scheduled-report recipients and schedule checked"),
    ],
    "OTP / boarding issue": [
        text("trip_emp", INFO, "Trip ID and employee ID"),
        text("phone", INFO, "Employee phone number registered and network"),
        confirm("otp_mode", CONFIG, "Client OTP mode (SMS / app / none) checked"),
    ],
    "Billing / invoice discrepancy": [
        text("invoice", INFO, "Invoice number and billing period"),
        text("trip_examples", INFO, "Example trip IDs that look wrong"),
        confirm("rate_card", CONFIG, "Rate card and vendor mapping checked"),
    ],
    "Employee address / geocode change": [
        text("emp_addr", INFO, "Employee ID, old address and new address"),
        confirm("pin", CONFIG, "Pin re-dropped manually and routing refreshed"),
    ],
    "Cab delay / no-show complaint": [
        text("trip_time", INFO, "Trip ID, scheduled time and actual time"),
        confirm("vendor", CONFIG, "Raised with vendor / ops desk first"),
    ],
    "Login / access issue": [
        text("user", INFO, "User email and exact error shown"),
        confirm("role_sso", CONFIG, "User role and SSO settings checked"),
    ],
    "How-to / feature request": [
        confirm("kb", HOWTO, "Help article searched and none answers this"),
        text("ask", INFO, "What the client wants to achieve"),
    ],
    "Driver / vehicle compliance docs": [
        text("doc", INFO, "Driver / vehicle ID and document type"),
        confirm("file", CONFIG, "File size and format checked against limits"),
    ],
}
