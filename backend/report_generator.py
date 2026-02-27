"""
MindMate Report Generator
PDF report generation using reportlab.
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
from ml_engine import MentalHealthAnalysis
import io


def get_risk_color(risk_level: str) -> tuple:
    """
    Get color tuple for risk level.
    
    Args:
        risk_level: Risk level string
        
    Returns:
        RGB color tuple
    """
    color_map = {
        "High": colors.HexColor("#DC3545"),  # Red
        "Moderate": colors.HexColor("#FFC107"),  # Yellow/Orange
        "Low": colors.HexColor("#28A745")  # Green
    }
    return color_map.get(risk_level, colors.HexColor("#6C757D"))


def generate_pdf_report(text: str, analysis: MentalHealthAnalysis) -> bytes:
    """
    Generate a PDF report for the mental health analysis.
    
    Args:
        text: Original user text
        analysis: MentalHealthAnalysis object with results
        
    Returns:
        PDF file as bytes
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for PDF elements
    story = []
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor("#34495E"),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=14
    )
    
    risk_style = ParagraphStyle(
        'RiskStyle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=get_risk_color(analysis.risk_level),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    disclaimer_style = ParagraphStyle(
        'DisclaimerStyle',
        parent=styles['BodyText'],
        fontSize=9,
        textColor=colors.HexColor("#7F8C8D"),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontStyle='italic'
    )
    
    # Title
    story.append(Paragraph("MindMate Mental Health Analysis Report", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Date
    date_str = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    story.append(Paragraph(f"<i>Generated on {date_str}</i>", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))
    
    # Risk Level Section
    story.append(Paragraph("Risk Assessment", heading_style))
    story.append(Paragraph(f"<b>Risk Level: {analysis.risk_level}</b>", risk_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Analysis Results Table
    data = [
        ['Metric', 'Value'],
        ['Sentiment Score', f"{analysis.sentiment_score:.3f}"],
        ['Detected Keywords', ', '.join(analysis.detected_keywords) if analysis.detected_keywords else 'None'],
        ['Emoji Count', str(analysis.emoji_count)],
    ]
    
    table = Table(data, colWidths=[2*inch, 4*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#34495E")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9FA")]),
    ]))
    
    story.append(table)
    story.append(Spacer(1, 0.3*inch))
    
    # User Text Section
    story.append(Paragraph("Analyzed Text", heading_style))
    # Truncate text if too long for PDF
    display_text = text[:500] + "..." if len(text) > 500 else text
    story.append(Paragraph(f'<i>"{display_text}"</i>', body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Explanation Section
    story.append(Paragraph("Analysis Explanation", heading_style))
    story.append(Paragraph(analysis.explanation, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Recommendation Section
    story.append(Paragraph("Recommendation", heading_style))
    story.append(Paragraph(analysis.recommendation, body_style))
    story.append(Spacer(1, 0.4*inch))
    
    # Disclaimer
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph(
        "⚠️ <b>IMPORTANT DISCLAIMER</b>",
        ParagraphStyle(
            'DisclaimerTitle',
            parent=disclaimer_style,
            fontSize=10,
            textColor=colors.HexColor("#E74C3C"),
            fontName='Helvetica-Bold'
        )
    ))
    story.append(Paragraph(
        "MindMate is an early risk awareness tool and does not replace professional medical advice. "
        "This analysis is for informational purposes only and should not be used as a substitute for "
        "professional mental health evaluation, diagnosis, or treatment. If you are experiencing a "
        "mental health crisis, please contact a mental health professional or emergency services immediately.",
        disclaimer_style
    ))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
