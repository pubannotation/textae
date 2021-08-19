file = File.open(__FILE__).to_a

data = DATA.to_a
data << data.shift
warn data.last

File.open(__FILE__, 'w') do |f|
  file.each do
    break if _1 == "__END__\n"
    f.write _1
  end
  f.write "__END__\n"
  data.each do
    f.write _1
  end
end

__END__
iPad
Firefox
Android
