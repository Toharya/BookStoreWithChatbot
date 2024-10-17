import sys
import json
import pandas as pd

file_path = "C:\\Users\\adils\\OneDrive\\Belgeler\\BookInformation.xlsx" 

df = pd.read_excel(file_path)
df.columns = ['book', 'author', 'paperback', 'publisher', 'description', 'price', 'category', 'pyear', 'links']

def filter_books(df, preferences):
    filtered_df = df.copy()
    if preferences['book']:
        filtered_df = filtered_df[filtered_df['book'].str.contains(preferences['book'], case=False, na=False)]
    if preferences['author']:
        filtered_df = filtered_df[filtered_df['author'].str.contains(preferences['author'], case=False, na=False)]
    if preferences['publisher']:
        filtered_df = filtered_df[filtered_df['publisher'].str.contains(preferences['publisher'], case=False, na=False)]
    if preferences['category']:
        filtered_df = filtered_df[filtered_df['category'].str.contains(preferences['category'], case=False, na=False)]
    if preferences['paperback']:
        try:
            max_pages = int(preferences['paperback'])
            filtered_df = filtered_df[pd.to_numeric(filtered_df['paperback'], errors='coerce').fillna(0) <= max_pages]
        except ValueError:
            print("You entered an invalid number of pages. There will be no page count filtering.")
    if preferences['price']:
        try:
            max_price = float(preferences['price'])
            filtered_df = filtered_df[pd.to_numeric(filtered_df['price'].str.replace(' TL', ''), errors='coerce') <= max_price]
        except ValueError:
            print("You entered an invalid price. There will be no price filtering.")
    filtered_df = filtered_df.where(pd.notnull(filtered_df), None)
    return filtered_df

def recommend_books(df, preferences):
    filtered_books = filter_books(df, preferences)
    if not filtered_books.empty:
        books = []
        for index, row in filtered_books.iterrows():
            book_info = {
                "book": row['book'],
                "author": row['author'],
                "publisher": row['publisher'],
                "paperback": row['paperback'],
                "description": row['description'],
                "price": row['price'],
                "category": row['category'],
                "pyear": int(row['pyear']),
                "links": row['links']
            }
            books.append(book_info)
        return books
    else:
        return []

if __name__ == "__main__":
    preferences = json.loads(sys.argv[1])
    recommended_books = recommend_books(df, preferences)
    if recommended_books:
        print(json.dumps(recommended_books))
    else:
        print(json.dumps([]))
