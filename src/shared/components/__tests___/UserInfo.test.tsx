import { render } from "@testing-library/react";
import { UserInfo } from "../UserInfo";

it('should match snapshot', () => {
  const { asFragment } = render(<UserInfo email="test@example.com" />);
  expect(asFragment()).toMatchSnapshot();
});