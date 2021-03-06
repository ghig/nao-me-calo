require "rails_helper"

feature "See tips", js: true do
  scenario "Click button of tips" do
    visit '/'
    click_link 'Apoio Legal'
    expect(page).to have_content 'Sofri discriminação, e agora?'
    sleep 5
    find_by_id('violencia_right').click
    expect(page).to have_content 'VIOLÊNCIA DOMÉSTICA'
    sleep 5
  end
end
