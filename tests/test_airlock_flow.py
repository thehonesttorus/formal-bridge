"""
Formal Bridge Stress Test Suite
================================
Selenium-based automated testing for the Statutory Distribution Audit.

Requirements:
    pip install selenium webdriver-manager pytest

Usage:
    pytest test_airlock_flow.py -v
"""

import pytest
import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager


BASE_URL = "http://localhost:3000"
TOXIC_CSV_PATH = os.path.join(os.path.dirname(__file__), "toxic_test_data.csv")


@pytest.fixture(scope="module")
def driver():
    """Setup Chrome WebDriver with headless option for CI."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Comment out for visual debugging
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.implicitly_wait(10)
    yield driver
    driver.quit()


class TestAirlockFlow:
    """Test the 7-step Airlock certification flow."""
    
    def test_01_landing_page_loads(self, driver):
        """Verify landing page loads correctly."""
        driver.get(BASE_URL)
        assert "Formal Bridge" in driver.title
        
    def test_02_navigate_to_airlock(self, driver):
        """Navigate to the Airlock portal."""
        driver.get(f"{BASE_URL}/portal/airlock")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Statutory Distribution Audit')]"))
        )
        
    def test_03_upload_toxic_csv(self, driver):
        """Upload the toxic test dataset."""
        # This test requires authentication - skip in CI
        driver.get(f"{BASE_URL}/portal/airlock")
        
        # Find file input (may be hidden)
        file_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']"))
        )
        file_input.send_keys(TOXIC_CSV_PATH)
        
        # Wait for parsing to complete and move to mapping step
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Confirm Columns')]"))
        )
        
    def test_04_column_mapping_suggestions(self, driver):
        """Verify fuzzy matching suggests correct columns."""
        # Check that 'Creditor Name' is suggested for Name column
        name_suggestion = driver.find_element(By.XPATH, "//*[contains(text(), 'Creditor Name')]")
        assert name_suggestion is not None
        
    def test_05_integrity_report_blocks_tbc(self, driver):
        """Verify TBC values trigger blocking issues."""
        # After column mapping, proceed to integrity step
        proceed_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Continue')]")
        proceed_btn.click()
        
        # Wait for Data Check step
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Data Integrity Report')]"))
        )
        
        # Verify blocking issues are shown
        blocking_section = driver.find_element(By.XPATH, "//*[contains(text(), 'Blocking')]")
        assert blocking_section is not None
        
        # Verify "Proceed" button is disabled
        proceed_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Proceed to Classification')]")
        assert "disabled" in proceed_btn.get_attribute("class") or proceed_btn.get_attribute("disabled")


class TestDataSanitization:
    """Unit tests for data sanitization logic (can run without browser)."""
    
    def test_currency_stripping(self):
        """Test that currency symbols are stripped correctly."""
        from formal_bridge.lib.data_sanitizer import sanitize_amount
        
        result = sanitize_amount("£10,500.50")
        assert result["value"] == 10500.50
        assert result["isValid"] == True
        
    def test_tbc_blocks(self):
        """Test that TBC values create blocking issues."""
        from formal_bridge.lib.data_sanitizer import sanitize_amount
        
        result = sanitize_amount("TBC")
        assert result["isValid"] == False
        assert any(w["type"] == "blocking" for w in result["warnings"])
        
    def test_approx_blocks(self):
        """Test that 'approx' values create blocking issues."""
        from formal_bridge.lib.data_sanitizer import sanitize_amount
        
        result = sanitize_amount("£48,000 approx")
        assert result["isValid"] == False
        
    def test_negative_parens(self):
        """Test that parentheses notation is converted to negative."""
        from formal_bridge.lib.data_sanitizer import sanitize_amount
        
        result = sanitize_amount("(5000)")
        assert result["value"] == -5000
        assert any(w["code"] == "CONTRA_DETECTED" for w in result["warnings"])


class TestPrescribedPartCalculation:
    """Test statutory Prescribed Part calculation."""
    
    def test_under_10k(self):
        """Test: £10,000 net → £5,000 (50%)."""
        from formal_bridge.lib.prescribed_part import calculate_prescribed_part
        
        result = calculate_prescribed_part(10000, "2024-01-01")
        assert result["finalAmount"] == 5000
        
    def test_450k_net(self):
        """Test: £450,000 net → £5,000 + (£440,000 × 20%) = £93,000."""
        from formal_bridge.lib.prescribed_part import calculate_prescribed_part
        
        result = calculate_prescribed_part(450000, "2024-01-01")
        assert result["finalAmount"] == 93000
        
    def test_cap_post_april_2020(self):
        """Test: Large amount capped at £800,000 (post April 2020)."""
        from formal_bridge.lib.prescribed_part import calculate_prescribed_part
        
        result = calculate_prescribed_part(5000000, "2021-01-01")
        assert result["finalAmount"] == 800000
        assert result["capApplied"] == True
        
    def test_cap_pre_april_2020(self):
        """Test: Large amount capped at £600,000 (pre April 2020)."""
        from formal_bridge.lib.prescribed_part import calculate_prescribed_part
        
        result = calculate_prescribed_part(5000000, "2019-01-01")
        assert result["finalAmount"] == 600000
        
    def test_boundary_date(self):
        """Test: Exactly April 6, 2020 uses new cap."""
        from formal_bridge.lib.prescribed_part import calculate_prescribed_part
        
        result = calculate_prescribed_part(5000000, "2020-04-06")
        assert result["finalAmount"] == 800000


class TestCrownPreferenceDetection:
    """Test Crown Preference (FA 2020) detection logic."""
    
    def test_hmrc_detected(self):
        """Test: 'HMRC' triggers Crown Preference warning."""
        from formal_bridge.lib.creditor_classifier import analyze_classifications
        
        creditors = [{"rowNumber": 1, "name": "HMRC Corporation Tax", "amount": 100000, "currentTier": "6"}]
        result = analyze_classifications(creditors)
        
        assert len(result["warnings"]) > 0
        assert any("3b" in str(w) for w in result["warnings"])
        
    def test_vat_detected(self):
        """Test: 'VAT' triggers Crown Preference warning."""
        from formal_bridge.lib.creditor_classifier import analyze_classifications
        
        creditors = [{"rowNumber": 1, "name": "VAT Liability Q4", "amount": 50000, "currentTier": "6"}]
        result = analyze_classifications(creditors)
        
        assert len(result["warnings"]) > 0
        
    def test_holiday_inn_not_flagged(self):
        """Test: 'Holiday Inn' (company name) NOT flagged as holiday pay."""
        from formal_bridge.lib.creditor_classifier import analyze_classifications
        
        creditors = [{"rowNumber": 1, "name": "Holiday Inn Conference", "amount": 12500, "currentTier": "6"}]
        result = analyze_classifications(creditors)
        
        # Should NOT have employee preferential warning
        assert not any("3a" in str(w) for w in result["warnings"])


class TestUsageLimits:
    """Test the 3 free certificate limit enforcement."""
    
    def test_api_usage_endpoint(self):
        """Test GET /api/usage returns correct structure."""
        import requests
        
        # Note: Requires authenticated session
        response = requests.get(f"{BASE_URL}/api/usage")
        
        if response.status_code == 401:
            pytest.skip("Authentication required for this test")
            
        data = response.json()
        assert "usedCount" in data
        assert "remainingFree" in data
        assert "hasReachedLimit" in data
        
    def test_fourth_certificate_blocked(self):
        """Test that 4th certificate returns 402."""
        # This test requires 3 certificates to already exist
        # Typically run in an isolated test environment
        pytest.skip("Requires test environment setup with 3 existing certificates")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
