import { ChakraProvider, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Calculator from './components/Calculator'
import Results from './components/Results'
import { useState } from 'react'

function App() {
  const [results, setResults] = useState(null)

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <header>
            <Heading as="h1" size="xl" textAlign="center" color="blue.600">
              Snake Plant ROI Calculator
            </Heading>
            <Text textAlign="center" color="gray.600" mt={2}>
              Calculate your potential returns on snake plant business investments
            </Text>
          </header>

          <Calculator onCalculate={setResults} />
          {results && <Results results={results} />}
        </VStack>
      </Container>
    </ChakraProvider>
  )
}

export default App
