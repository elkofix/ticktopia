import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

describe('Button component', () => {
    it('renders children text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('applies default "primary" variant class', () => {
        render(<Button>Primary</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn', 'btn-primary')
    })

    it('applies "secondary" variant class', () => {
        render(<Button variant="secondary">Secondary</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn', 'btn-secondary')
    })

    it('applies "danger" variant class', () => {
        render(<Button variant="danger">Danger</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn', 'btn-danger')
    })

    it('applies additional className', () => {
        render(<Button className="custom-class">With Custom Class</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('custom-class')
    })

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn()
        render(<Button onClick={handleClick}>Click</Button>)
        fireEvent.click(screen.getByText('Click'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies both variant and custom class', () => {
        render(<Button variant="secondary" className="extra-style">Test</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveClass('btn', 'btn-secondary', 'extra-style')
    })

})
