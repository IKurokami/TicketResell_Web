describe('Login Functionality', () => {
  beforeEach(() => {
    // Mở trang đăng nhập trước mỗi bài kiểm tra
    cy.visit('http://localhost:3000/login');
  });

  it('should log in with valid credentials', () => {
    // Nhập thông tin đăng nhập hợp lệ
    cy.get('input').eq(0).type('ceyeno9589@angewy.com');
    cy.wait(3000); // Đợi 1 giây

    cy.get('input').eq(1).type('ceyeno9589@angewy.com');
    cy.wait(3000); // Đợi 1 giây

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]').click();
    cy.wait(3000); // Đợi 2 giây

    // Kiểm tra xem người dùng đã đăng nhập thành công
    cy.url().should('include', '/');
  });

  it('should show error with invalid credentials', () => {
    // Nhập thông tin đăng nhập không hợp lệ
    cy.get('input').eq(0).type('user@example.com');
    cy.wait(3000); // Đợi 1 giây

    cy.get('input').eq(1).type('password123');
    cy.wait(3000); // Đợi 1 giây

    // Nhấn nút đăng nhập
    cy.get('button[type="submit"]').click();
    cy.wait(3000); // Đợi 2 giây

    // Kiểm tra thông báo lỗi
    cy.contains('Invalid email or password');
  });
});
