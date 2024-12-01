import {
  Box,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Results = ({ results }) => {
  const toast = useToast()

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(number)
  }

  const chartData = {
    labels: results.monthlyData.map(data => `Month ${data.month}`),
    datasets: [
      {
        label: 'Net Profit',
        data: results.monthlyData.map(data => data.profit),
        borderColor: 'rgb(72, 187, 120)',
        backgroundColor: 'rgba(72, 187, 120, 0.5)',
      },
      {
        label: 'Revenue',
        data: results.monthlyData.map(data => data.revenue),
        borderColor: 'rgb(66, 153, 225)',
        backgroundColor: 'rgba(66, 153, 225, 0.5)',
      },
      {
        label: 'Costs',
        data: results.monthlyData.map(data => data.costs),
        borderColor: 'rgb(245, 101, 101)',
        backgroundColor: 'rgba(245, 101, 101, 0.5)',
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Financial Performance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  }

  const handlePrint = () => {
    window.print()
  }

  const handleSavePDF = async () => {
    try {
      const element = document.getElementById('results-container')
      const canvas = await html2canvas(element)
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30

      pdf.setFontSize(20)
      pdf.text('Snake Plant ROI Calculator Results', 20, 20)
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('snake-plant-roi-calculation.pdf')

      toast({
        title: 'PDF Saved',
        description: 'Your results have been saved as a PDF.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box id="results-container" p={6} bg="white" borderRadius="lg" shadow="base">
      <VStack spacing={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="100%">
          <Stat>
            <StatLabel>Total Revenue</StatLabel>
            <StatNumber>{formatCurrency(results.totalRevenue)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Costs</StatLabel>
            <StatNumber>{formatCurrency(results.totalCosts)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Net Profit</StatLabel>
            <StatNumber>{formatCurrency(results.netProfit)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ROI Percentage</StatLabel>
            <StatNumber>{results.roiPercentage.toFixed(2)}%</StatNumber>
          </Stat>
        </SimpleGrid>

        <Box w="100%" h="400px">
          <Line data={chartData} options={chartOptions} />
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
          <Button onClick={handlePrint} colorScheme="blue">
            Print Results
          </Button>
          <Button onClick={handleSavePDF} colorScheme="green">
            Save as PDF
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Results
