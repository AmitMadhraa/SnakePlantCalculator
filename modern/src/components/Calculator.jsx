import { useState } from 'react'
import {
  Box,
  Button,
  SimpleGrid,
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Heading,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

const Calculator = ({ onCalculate }) => {
  const [isCalculating, setIsCalculating] = useState(false)
  const toast = useToast()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      initialInvestment: '',
      timeframe: '',
      plantQuantity: '',
      pricePerPlant: '',
      propagationRate: '',
      monthlyCosts: '',
      marketingCosts: '',
    }
  })

  const calculateROI = (data) => {
    setIsCalculating(true)
    
    try {
      const months = parseInt(data.timeframe)
      let totalPlants = parseInt(data.plantQuantity)
      const propagationRate = parseFloat(data.propagationRate) / 100
      const pricePerPlant = parseFloat(data.pricePerPlant)
      const monthlyCosts = parseFloat(data.monthlyCosts)
      const marketingCosts = parseFloat(data.marketingCosts)
      const initialInvestment = parseFloat(data.initialInvestment)

      let monthlyData = []
      let totalRevenue = 0
      let totalCosts = initialInvestment

      // Calculate monthly growth and revenue
      for (let month = 1; month <= months; month++) {
        const newPlants = Math.floor(totalPlants * propagationRate)
        totalPlants += newPlants
        
        const monthlyRevenue = totalPlants * pricePerPlant * 0.1 // Assume 10% of plants sold per month
        totalRevenue += monthlyRevenue
        
        const monthlyTotalCosts = monthlyCosts + marketingCosts
        totalCosts += monthlyTotalCosts

        monthlyData.push({
          month,
          plants: totalPlants,
          revenue: monthlyRevenue,
          costs: monthlyTotalCosts,
          profit: monthlyRevenue - monthlyTotalCosts
        })
      }

      const netProfit = totalRevenue - totalCosts
      const roiPercentage = (netProfit / initialInvestment) * 100

      onCalculate({
        totalRevenue,
        totalCosts,
        netProfit,
        roiPercentage,
        monthlyData
      })

      toast({
        title: 'Calculation Complete',
        description: 'Your ROI has been calculated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Calculation Error',
        description: 'There was an error calculating your ROI. Please check your inputs.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    reset()
    onCalculate(null)
  }

  return (
    <Box as="form" onSubmit={handleSubmit(calculateROI)} p={6} bg="white" borderRadius="lg" shadow="base">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4}>Basic Information</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Initial Investment ($)</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  {...register('initialInvestment', { required: true, min: 0 })}
                  placeholder="Enter initial investment"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Investment Timeframe (months)</FormLabel>
              <NumberInput min={1} max={120}>
                <NumberInputField
                  {...register('timeframe', { required: true, min: 1, max: 120 })}
                  placeholder="Enter timeframe in months"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Plant Details</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Initial Number of Plants</FormLabel>
              <NumberInput min={1}>
                <NumberInputField
                  {...register('plantQuantity', { required: true, min: 1 })}
                  placeholder="Enter number of plants"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Average Selling Price per Plant ($)</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  {...register('pricePerPlant', { required: true, min: 0 })}
                  placeholder="Enter price per plant"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Monthly Propagation Rate (%)</FormLabel>
              <NumberInput min={0} max={100}>
                <NumberInputField
                  {...register('propagationRate', { required: true, min: 0, max: 100 })}
                  placeholder="Enter propagation rate"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Operational Costs</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Monthly Maintenance Costs ($)</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  {...register('monthlyCosts', { required: true, min: 0 })}
                  placeholder="Enter monthly costs"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Monthly Marketing Costs ($)</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  {...register('marketingCosts', { required: true, min: 0 })}
                  placeholder="Enter marketing costs"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </SimpleGrid>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isCalculating}
            loadingText="Calculating..."
          >
            Calculate ROI
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset Form
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Calculator
